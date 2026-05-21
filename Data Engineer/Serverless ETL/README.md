# Serverless ETL with EMR Serverless & Spark

We'll have hands‑on experience with **EMR Serverless**, a powerful alternative to Glue, and orchestrate it from **Step Functions**. This is a scenario about choosing between Glue and EMR, Spark tuning, and serverless options.

---

### 🛠️ Prerequisites
- The AWS account and region you’ve been using (e.g., `ap-southeast-2`).
- An S3 bucket (I’ll use `de-project-data-lake-<account-id>`). If you need to create one, do it now.
- Permissions to create IAM roles, EMR Serverless applications, Step Functions state machines, and Glue resources.

> ⚠️ **Cost notes**: EMR Serverless charges based on vCPU‑hours and memory. For this small test, it will cost less than $0.20. Stop the application after use. Step Functions charges per state transition (a few cents). S3 and Athena are negligible.

---

## Step 1: Prepare the dataset in S3

We’ll use a public NYC Taxi dataset (CSV) for its realistic size and schema.

1. Create `taxi/` folder inside `rawData/`.
2. Upload  [Yellow Taxi Dataset](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page). 
2. Verify: `aws s3 ls s3://de-project-data-lake-<account-id>/rawData/taxi/`

Now you have a realistic dataset sitting in your data lake.

---

## Step 2: Create an IAM role for EMR Serverless

EMR Serverless needs a runtime role to access S3 and the Glue Data Catalog. We’ll craft a least‑privilege role.

1. **IAM → Roles → Create role**
   - Trusted entity type: **Custom trust policy**
   - Paste this trust policy:
     ```json
     {
         "Version": "2012-10-17",
         "Statement": [
             {
                 "Effect": "Allow",
                 "Principal": {
                     "Service": "emr-serverless.amazonaws.com"
                 },
                 "Action": "sts:AssumeRole"
             }
         ]
     }
     ```
   - Next.

2. Name the role `EMRServerlessExecRole`. Copy the ARN.

3. Create an inline policy (or separate managed policies). Use this JSON, adjusting your bucket name:
   ```json
   {
       "Version": "2012-10-17",
       "Statement": [
           {
               "Effect": "Allow",
               "Action": [
                   "s3:GetObject",
                   "s3:ListBucket"
               ],
               "Resource": [
                   "arn:aws:s3:::de-project-data-lake-<account-id>",
                   "arn:aws:s3:::de-project-data-lake-<account-id>/rawData/taxi/*"
               ]
           },
           {
               "Effect": "Allow",
               "Action": [
                   "s3:PutObject"
               ],
               "Resource": "arn:aws:s3:::de-project-data-lake-<account-id>/processedData/taxi_agg/*"
           },
           {
               "Effect": "Allow",
               "Action": [
                   "glue:GetDatabase",
                   "glue:GetTable",
                   "glue:GetPartitions",
                   "glue:CreateTable",
                   "glue:UpdateTable"
               ],
               "Resource": "*"
           },
           {
               "Effect": "Allow",
               "Action": [
                   "logs:CreateLogGroup",
                   "logs:CreateLogStream",
                   "logs:PutLogEvents"
               ],
               "Resource": "arn:aws:logs:*:*:*"
           }
       ]
   }
   ```
   Name the inline policy `EMRServerlessS3GlueAccess`.

---

## Step 3: Catalog the raw CSV with a Glue Crawler

We want the PySpark script to read from the Glue Catalog table, not directly from a file path.

1. **Glue Console → Crawlers → Create crawler**  
   - Name: `raw-taxi-crawler`  
   - Data source: S3 path `s3://de-project-data-lake-<account-id>/rawData/taxi/`  
   - IAM role: choose the existing Glue service role from earlier projects (e.g., `GlueServiceRoleDE`). If you don’t have one, create a new role for Glue with S3 read access.  
   - Database: create a new database `taxi_db` → Table name prefix: `raw_`
   - Frequency: Run on demand  
   - Finish and run.

2. After the crawler finishes, you’ll find a table `raw_yellow_tripdata_2024_01` in the `taxi_db` database. Note the table name; we’ll use it in the Spark script.

---

## Step 4: Write the PySpark script

We’ll write a Spark job that:
- Reads the raw table from the Glue Catalog.
- Aggregates total fares and average trip distance by pickup location and hour.
- Writes the result as Parquet to `processedData/taxi_agg/`, and also registers it in the Glue Catalog for Athena querying.

Create a file named `taxi_etl.py` with this content (adjust bucket and table names):

```python
import sys
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, hour, avg, sum as _sum

def main():
    # EMR Serverless sets the Spark session automatically;
    # we just need to enable Hive support for Glue Catalog.
    spark = SparkSession.builder \
        .appName("TaxiETL") \
        .config("spark.sql.catalogImplementation", "hive") \
        .enableHiveSupport() \
        .getOrCreate()

    # Read raw table from Glue Data Catalog
    raw_df = spark.table("taxi_db.raw_yellow_tripdata_2024_01")

    # Basic transformations
    # Select columns of interest, drop rows with null pickup time or location
    clean_df = raw_df.select(
        col("tpep_pickup_datetime"),
        col("trip_distance"),
        col("fare_amount"),
        col("pulocationid")
    ).na.drop(subset=["tpep_pickup_datetime", "pulocationid"])

    # Create an hour column
    hourly_df = clean_df.withColumn("pickup_hour", hour(col("tpep_pickup_datetime")))

    # Aggregation: total fare and avg distance per location per hour
    agg_df = hourly_df.groupBy("pulocationid", "pickup_hour").agg(
        _sum("fare_amount").alias("total_fare"),
        avg("trip_distance").alias("avg_trip_distance")
    )

    # Write output as Parquet to S3
    output_path = "s3://de-project-data-lake-<account-id>/processedData/taxi_agg/"
    agg_df.write \
        .mode("overwrite") \
        .format("parquet") \
        .option("path", output_path) \
        .saveAsTable("taxi_db.processed_taxi_hourly")   # also creates/updates table in Glue Catalog

    spark.stop()

if __name__ == "__main__":
    main()
```

**Important notes:**
- We use `saveAsTable` to automatically create/update the table in the Glue Catalog. This requires the `glue:CreateTable` and `glue:UpdateTable` permissions we already granted.
- `spark.sql.catalogImplementation` = `hive` is needed in EMR Serverless to use the Glue Catalog as the metastore (it’s set by default in Glue, but not in EMR without Hive support enabled).
- The `output_path` must be exactly the S3 location where the Parquet data will reside; the table’s location will be set to that path.

Upload the script to your S3 bucket:  
`s3://de-project-data-lake-<account-id>/scripts/taxi_etl.py`

---

## Step 5: Create the EMR Serverless application

1. Open **EMR** console → **EMR Serverless** → **Create application**.
   - **Name**: `taxi-etl-app`
   - **Type**: Spark
   - **Release version**: `emr-6.10.0` (or the latest available)
   - **Architecture**: x86_64
   - **Initial capacity**: optionally pre‑initialise capacity to speed up your job. I’ll leave it empty for now (cold start takes a couple of minutes).
   - **Application setup options**: choose **Custom settings**
     - **Maximum capacity**: 4 vCPUs, 30 GB memory (or lower if you want; this is for small dataset).
     - Pre‑initialised capacity: 0 (to save cost when idle).
   - Leave other defaults (logging enabled, etc.) → **Create application**.

2. Once application is in “Created” state, note the **Application ID**.

---

## Step 6: Test the Spark job manually

Before orchestration, ensure the job runs correctly.

1. **Submit a job run from the EMR console:**
   - Go to the application → **Submit job**.
   - **Job name**: `taxi-etl-test`
   - **Runtime role**: choose `EMRServerlessExecRole` (use the “Browse” button).
   - **Script location**: `s3://de-project-data-lake-<account-id>/scripts/taxi_etl.py`
   - **Spark properties** (optional): leave empty; the defaults work.
   - **Submit**.

2. Monitor the job in the **Job runs** tab. It will take a few minutes to start (cold start) and then execute.

3. After success, verify the output:
   - Check S3 `processedData/taxi_agg/` for Parquet files.
   - In Athena, select the `taxi_db` database and run:
     ```sql
     SELECT * FROM processed_taxi_hourly LIMIT 10;
     ```
   You should see aggregated data.

If you hit permission issues, double‑check the IAM role’s S3 and Glue permissions. The job logs are available in CloudWatch Logs; check the `/aws-emr-serverless-logs/` log group for error details.

---

## Step 7: Orchestrate with Step Functions

Now we’ll build a state machine that automatically triggers this job.

### 7.1 IAM role for Step Functions
Create a role `StepFunctionsEMRServerlessRole`:
- Trusted entity: **Step Functions**
- Add an inline policy:
  ```json
  {
      "Version": "2012-10-17",
      "Statement": [
          {
              "Effect": "Allow",
              "Action": [
                  "emr-serverless:StartJobRun",
                  "emr-serverless:GetJobRun",
                  "emr-serverless:CancelJobRun"
              ],
              "Resource": "arn:aws:emr-serverless:ap-southeast-2:<account-id>:applications/<application-id>"
          },
          {
              "Effect": "Allow",
              "Action": [
                  "logs:CreateLogDeliverySubscription",
                  "logs:PutResourcePolicy",
                  "logs:DescribeResourcePolicies",
                  "logs:DescribeLogGroups"
              ],
              "Resource": "*"
          }
      ]
  }
  ```
  Replace `<application-id>` with the actual ID (you can find it under EMR Serverless, e.g., `00fq5n6h21j9rn09`).
- Also attach `AmazonS3FullAccess` or a scoped policy to read the script – but it’s better to add a statement allowing `s3:GetObject` on the script bucket. For simplicity, you can add `s3:GetObject` for `arn:aws:s3:::de-project-data-lake-<account-id>/scripts/*`.

### 7.2 State machine definition
Go to **Step Functions** → **State machines** → **Create state machine**.
- Choose **Write your workflow in code** (Amazon States Language).
- Type: **Standard**.
- Paste the following JSON, replacing placeholders:

```json
{
  "Comment": "Orchestrate EMR Serverless Spark ETL",
  "StartAt": "Run EMR Serverless Job",
  "States": {
    "Run EMR Serverless Job": {
      "Type": "Task",
      "Resource": "arn:aws:states:::emr-serverless:startJobRun.sync",
      "Parameters": {
        "ApplicationId": "<application-id>",
        "ExecutionRoleArn": "arn:aws:iam::<account-id>:role/EMRServerlessExecRole",
        "JobDriver": {
          "SparkSubmit": {
            "EntryPoint": "s3://de-project-data-lake-<account-id>/scripts/taxi_etl.py",
            "EntryPointArguments": [],
            "SparkSubmitParameters": "--conf spark.executor.cores=2 --conf spark.executor.memory=4g"
          }
        },
        "ExecutionTimeoutMinutes": 30,
        "Name": "TaxiETLJob"
      },
      "End": true
    }
  }
}
```

- **Note**: `SparkSubmitParameters` is optional; you can omit it.  
- **The `.sync` integration pattern** tells Step Functions to wait for the job run to complete. The state machine will stay active during the job execution.

3. **Permissions**: select `StepFunctionsEMRServerlessRole`.
4. Create and run a test execution. You should see the job succeed and the state turn green.

---

## Step 8: Verify the full workflow

- After a successful Step Functions execution, go to Athena and query the aggregated table again to confirm fresh data.
- You’ve just built an end‑to‑end serverless Spark pipeline orchestrated by Step Functions.

---

## 🧹 Cleanup
- **EMR Serverless application**: stop it (no charges if idle) or delete it.  
- **Step Functions state machine**: delete if not needed.  
- **S3 objects**: delete the scripts and output if desired.  
- **Glue Database**: delete `taxi_db` (and the crawler).  
- **IAM roles**: remove the ones you created if they’re not shared.

> 💡 Keep the IAM role `EMRServerlessExecRole` if you plan to reuse EMR Serverless; otherwise, clean it up.

---

## 📚 What you learned (and exam relevance)
- **EMR Serverless**: How it differs from Glue (you control Spark config, driver/executor sizing, and can use open‑source libraries). Key exam point: **cost optimisation**—EMR Serverless auto‑scales but you can set max capacity.
- **Integrating Glue Data Catalog with EMR**: using `spark.sql.catalogImplementation = hive` and `enableHiveSupport()`. This is essential for cross‑service compatibility.
- **Orchestration**: Step Functions `.sync` with EMR Serverless to pause the workflow until the job completes, without needing Lambda pollers.
- **Least privilege IAM**: You gave the EMR role exactly the S3 paths and Glue actions it needed—no more.
- **Data lake zones**: raw → processed aggregation, demonstrating medallion architecture.

This project hits multiple exam domains. Once you’re comfortable with it, you’ll be able to answer questions about EMR Serverless, Glue catalog integration, and the trade‑offs between Glue and EMR with confidence.

Would you like to try the DMS CDC project next, or another two‑star project?