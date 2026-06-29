# Real‑Time Metrics with Kinesis Data Analytics (SQL)

Let's build a real‑time streaming analytics pipeline using **Kinesis Data Analytics for SQL**. This project introduces streaming SQL (without the complexity of Flink) and shows how to output results to both a data lake and a live DynamoDB table.

We'll compute a 1‑minute rolling average of temperature and humidity per device, then store both the live results (DynamoDB) and historical archive (S3).

---

### 🛠️ Prerequisites
- The same AWS account and region you've been using.
- The `iot-data-stream` Kinesis stream from the Serverless Data Lake project (or create a new one with on‑demand capacity). We'll reuse the IoT simulator script.
- An S3 bucket for Firehose output (e.g., `de-project-data-lake-<account-id>`).
- IAM permissions for Kinesis Data Analytics, Lambda, DynamoDB, Firehose.

> ⚠️ **Cost warning**: Kinesis Data Analytics for SQL charges per KPU‑hour (~$0.11 per KPU per hour). We'll use 1 KPU (minimum). A few hours of testing costs less than $0.50. Delete the application after use. Kinesis Data Stream (on‑demand) and Firehose are minimal. DynamoDB on‑demand is free for low usage.

---

## Step 1: Prepare the IoT data generator (if not already running)

Reuse the script `iot_simulator.py` from the Data Lake project. It sends records like:

```json
{
    "device_id": "sensor-3",
    "temperature": 23.45,
    "humidity": 55.2,
    "timestamp": "2024-01-15T10:00:00Z"
}
```

Make sure the region matches. Run the script for the duration of the project.

---

## Step 2: Create the DynamoDB table for live metrics

We'll store the latest aggregated metric per device per minute. Use a composite key with `device_id` (PK) and `window_start` (SK). Add a TTL attribute to auto‑expire old data after 24 hours.

1. **DynamoDB → Create table**
   - Table name: `DeviceMetrics`
   - Partition key: `device_id` (String)
   - Sort key: `window_start` (String)
   - Capacity mode: On‑demand

2. After creation, enable TTL:
   - Table → **Time to Live (TTL)** → **Turn On**.
   - Attribute name: `expire_at` (we'll set this in the Lambda).
   - Turn On TTL.

---

## Step 3: Create the Kinesis Data Analytics SQL application

### 3.1 Create the Managed Apache Flink application

1. Open the **Kinesis** console → **Managed Apache Flink** → **Studio Notebook** → **Create Studio Notebook**.
    - Notebook name: `device-metrics-notebook`
    - AWS Glue Database: Create New DB
    - Create Studio Notebook

2. After creation, click the application name → **RUN** → **Open in Apache Zeppelin**

3. Add Policy for the previously created IAM role when creating notebook.
- **Add permissions -> Create inline policy**.
- In JSON tab, paste the code below:

```JSON
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "kinesis:ListShards",
                "kinesis:DescribeStream",
                "kinesis:DescribeStreamSummary",
                "kinesis:GetRecords",
                "kinesis:GetShardIterator",
                "kinesis:PutRecord",
                "kinesis:PutRecords"
            ],
            "Resource": [
                "arn:aws:kinesis:ap-southeast-2:406682760260:stream/iot-data-stream",
                "arn:aws:kinesis:ap-southeast-2:406682760260:stream/device-metrics-stream"
            ]
        },
        {
            "Effect": "Allow",
            "Action": [
                "firehose:DescribeDeliveryStream",
                "firehose:PutRecord",
                "firehose:PutRecordBatch"
            ],
            "Resource": "arn:aws:firehose:ap-southeast-2:406682760260:deliverystream/device-metrics-firehose"
        }
    ]
}
```
- Click **Next**, give the policy a name (e.g. `FlinkStreamsAccess`), then **Create Policy**
- Add Permission again, the choose **Attach Policies**.
- Search `AWSGlueConsoleFullAccess` -> **Add Permission**

### 3.2 Create the input table for the IoT stream

Before creating the notebook, we need to create new Kinesis Data Stream (`device-metrics-stream`) and Firehose (`device-metrics-firehose`) first as a Sink for output stream. For creating the Firehose:
1. In the Kinesis Console, click Amazon Data Firehose.
2. Create Firehose stream.
3. Source: Choose Direct PUT.
4. Destination: Amazon S3.
5. Delivery stream name: `device-metrics-firehose`.
6. In Destination settings, choose your S3 bucket and set the prefix to processedData/metrics/.
7. Klik Create Firehose stream.

In the notebook, create a new note (e.g., “RealTimeMetrics”). In the first paragraph, define the source table that reads from your existing Kinesis stream `iot-data-stream`. Paste the following Flink SQL and run it:

```sql
%flink.ssql

CREATE TABLE iot_source (
    device_id    STRING,
    temperature  DOUBLE,
    humidity     DOUBLE,
    `timestamp`  STRING,       -- ISO timestamp, we'll use ROWTIME instead
    event_time   AS TO_TIMESTAMP(`timestamp`),   -- optional: if you want event time
    -- Flink adds a proctime attribute
    proctime AS PROCTIME()
)
PARTITIONED BY (device_id)
WITH (
    'connector' = 'kinesis',
    'stream' = 'iot-data-stream',
    'aws.region' = 'ap-southeast-2',
    'scan.stream.initpos' = 'LATEST',
    'format' = 'json'
);
```

- Adjust the region to yours.
- The event_time computed column converts your timestamp string to a SQL timestamp, but we can just use processing time (PROCTIME()) for simplicity.

### 3.3 Create the output tables

Define two sink tables – one for the Kinesis stream that goes to Lambda/DynamoDB, and one for the Firehose delivery stream that goes to S3.

**Sink for the Kinesis output stream** (`device-metrics-stream`):

```sql
%flink.ssql

CREATE TABLE metrics_stream_output (
    device_id      STRING,
    window_start   TIMESTAMP(3),
    avg_temperature DOUBLE,
    avg_humidity   DOUBLE,
    record_count   BIGINT
)
WITH (
    'connector' = 'kinesis',
    'stream' = 'device-metrics-stream',
    'aws.region' = 'ap-southeast-2',
    'format' = 'json'
);
```

**Sink for the Firehose delivery stream** (`device-metrics-firehose`):

```sql
%flink.ssql

CREATE TABLE firehose_output (
    device_id      STRING,
    window_start   TIMESTAMP(3),
    avg_temperature DOUBLE,
    avg_humidity   DOUBLE,
    record_count   BIGINT
)
WITH (
    'connector' = 'firehose',
    'delivery-stream' = 'device-metrics-firehose',
    'aws.region' = 'ap-southeast-2',
    'format' = 'json'
);
```
### 3.4 Write the streaming aggregation query

Now create a continuous query that aggregates temperature and humidity over a `1‑minute HOP window` (size 1 minute, slide 10 seconds) and inserts the results into both sinks. This replaces the old pump logic.

```sql
%flink.ssql

INSERT INTO metrics_stream_output
SELECT
    device_id,
    HOP_START(proctime, INTERVAL '10' SECONDS, INTERVAL '1' MINUTE) AS window_start,
    AVG(temperature) AS avg_temperature,
    AVG(humidity)   AS avg_humidity,
    COUNT(*)        AS record_count
FROM iot_source
GROUP BY
    device_id,
    HOP(proctime, INTERVAL '10' SECONDS, INTERVAL '1' MINUTE);
```

- `HOP(proctime, slide, size)` defines a sliding window.
- You can run another `INSERT INTO firehose_output` with the same query to duplicate the data to Firehose. Flink does not support writing to two sinks in the same statement directly; you need two separate INSERT INTO statements.

```SQL
%flink.ssql

INSERT INTO firehose_output
SELECT
    device_id,
    HOP_START(proctime, INTERVAL '10' SECONDS, INTERVAL '1' MINUTE) AS window_start,
    AVG(temperature) AS avg_temperature,
    AVG(humidity)   AS avg_humidity,
    COUNT(*)        AS record_count
FROM iot_source
GROUP BY
    device_id,
    HOP(proctime, INTERVAL '10' SECONDS, INTERVAL '1' MINUTE);
```

Both queries will run continuously once the note is started.

### 3.5 Run the streaming queries
- In the notebook, make sure your IoT simulator is running and producing data.
- Click the **Run all paragraphs** button (or run each paragraph individually). The notebook will show a spinning indicator while the query is active.
- After a minute, you should see the output streams receiving data. You can verify by temporarily querying the output table with a `SELECT * FROM metrics_stream_output LIMIT 10` (use `%flink.ssql`), but note that reading from a Kinesis stream in the same notebook may consume records. It's easier to check via the Lambda and S3 outputs.

## Step 4: Create the Lambda to write to DynamoDB

We need a Lambda function that reads from `device-metrics-stream`, extracts the aggregated data, and upserts it into DynamoDB.

1. **Lambda → Create function** → Author from scratch.
   - Name: `StoreMetricsToDynamoDB`
   - Runtime: Python 3.14+
2. Under Additional Settings, enable Custom execution role. Click Create new role and attach the following managed policies:
   - `AmazonDynamoDBFullAccess` (or a scoped policy for PutItem on `DeviceMetrics`).
   - `AWSLambdaKinesisExecutionRole` (to read from the Kinesis stream).
3. Create Function

4. Paste the function code:

```python
import json
import boto3
import time
import base64
from decimal import Decimal

dynamodb = boto3.resource('dynamodb')
table = dynamodb.Table('DeviceMetrics')

def float_to_decimal(obj):
    """Convert float values to Decimal for DynamoDB."""
    if isinstance(obj, float):
        return Decimal(str(obj))
    return obj

def lambda_handler(event, context):
    for record in event['Records']:
        try:
            # 1. Buka sandi Base64 dari Kinesis
            raw_data = record['kinesis']['data']
            decoded_data = base64.b64decode(raw_data).decode('utf-8')
            
            # 2. Ubah string menjadi JSON (Dictionary)
            payload = json.loads(decoded_data)
            
            # 3. Siapkan data untuk DynamoDB
            item = {
                'device_id': payload['device_id'],
                'window_start': str(payload['window_start']),  # Pastikan jadi string
                'avg_temperature': float_to_decimal(payload['avg_temperature']),
                'avg_humidity': float_to_decimal(payload['avg_humidity']),
                'record_count': int(payload['record_count']),
                'expire_at': int(time.time()) + 86400
            }
            print(f"Berhasil menyimpan: {item}")
            table.put_item(Item=item)
            
        except Exception as e:
            print(f"Error memproses data: {e}")
            print(f"Data mentah: {record['kinesis']['data']}")
            
    return {'statusCode': 200}
```

4. **Deploy** the function.

5. **Add the Kinesis trigger**:
   - In the Lambda console, click **Add trigger**.
   - Source: **Kinesis**
   - Kinesis stream: `device-metrics-stream`
   - Batch size: 10
   - Starting position: Latest
   - Add.

Now, as soon as the Kinesis Analytics application starts pumping data into `device-metrics-stream`, the Lambda will populate DynamoDB.

---

## Step 5: Test the pipeline

1. **Start the IoT simulator** if not already running.
2. In the Kinesis Analytics SQL editor, you should see the **Real time analytics** tab showing rows flowing through.
3. Wait a minute, then check:
   - **DynamoDB** → **Explore items** → `DeviceMetrics` table. You should see items with `device_id`, `window_start`, average metrics, and `expire_at`.
   - **S3** → `processedData/metrics/` after a minute or two, Firehose delivers Parquet/JSON files (depending on buffer). Download and verify content.
4. **Monitor**: Go to CloudWatch Metrics → **AWS/KinesisAnalytics** → your application. Check `MillisBehindLatest`, `InputBytes`, `OutputRecords`.

---

## 🧹 Cleanup

- **Kinesis Data Analytics application**: Stop and delete the SQL application.
- **Kinesis streams**: Delete `device-metrics-stream` and stop the IoT simulator. Keep `iot-data-stream` if you'll use it for other projects.
- **Firehose delivery stream**: Delete `device-metrics-firehose`.
- **DynamoDB table**: Delete `DeviceMetrics`.
- **Lambda function**: Delete `StoreMetricsToDynamoDB`.
- **S3 output**: Delete the `processedData/metrics/` folder if not needed.
- **IAM roles**: Remove the Kinesis Analytics service role and the Lambda role if you created them specifically.

---

## 📚 What this project teaches for the DEA‑C01 exam

- **Kinesis Data Analytics (SQL)**: Real‑time aggregation using sliding windows, pumps, stream outputs.
- **Streaming SQL syntax**: `CREATE STREAM`, `CREATE PUMP`, `FLOOR`, `AVG`, `COUNT`, and working with `ROWTIME`.
- **Multiple destinations**: Sending the same analytical results to both a low‑latency store (DynamoDB) and an archive (S3 via Firehose).
- **Lambda integration**: Processing Kinesis stream records, handling base64 decoding, and writing to DynamoDB with TTL.
- **Monitoring streaming applications**: Key metrics like `millisBehindLatest`, capacity KPU, input/output record counts.
- **Kinesis Data Analytics vs. Flink**: The exam tests when to use the simpler SQL engine vs. Apache Flink for complex event processing.

You've now built a complete streaming analytics loop—a skill directly applicable to exam scenarios and real‑world data engineering. Let me know if you'd like to move on to another project or need any clarification!