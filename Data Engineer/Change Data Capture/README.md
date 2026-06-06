# Change Data Capture with DMS to S3 & Redshift

We will build a Change Data Capture pipeline that captures changes from a PostgreSQL database using AWS DMS, writes them to S3, processes them with Glue, and keeps a Redshift warehouse in sync.

## 🛠️ Prerequisites

- An AWS account and the region you’ve been using.
- IAM user with administrator access for setup.
- Cost awareness:
  - DMS replication instance (dms.t3.micro): ~$0.021/hour
  - RDS PostgreSQL (db.t3.micro, free tier eligible)
  - Glue job, Lambda, S3: minimal costs
  - Redshift Serverless (8 RPUs, minimum): ~$1.08/hour — only keep running during active testing

Delete everything when you're done to avoid unexpected charges.

## Step 1: Create the Source RDS PostgreSQL Database

1. Go to **RDS** Console → **Create database** → Full Configuration.
2. **Engine**: PostgreSQL (latest version).
3. **Template**: Sandbox.
4. **DB instance identifier**: `dms-source-db`
5. **Master username**: `postgres`, **Master password**: choose a secure password (save it).
6. **Instance class**: `db.t3.micro`
7. **Storage**: 20 GB gp2 (default).
8. **Connectivity**: Public access **Yes** (for easier setup; restrict in production).
      VPC security group: Create a new one with an inbound rule allowing TCP port `5432` from your IP (`0.0.0.0/0` for simplicity).
9. **Additional configuration → DB parameter group**:
      Create a new parameter group (or modify the default). Set the following parameters required for DMS CDC:
   - `rds.logical_replication = 1`
   - `wal_sender_timeout = 0`
   - `max_replication_slots = 10`
   - `max_wal_senders = 10`
   
   (To create a new parameter group: RDS → Parameter groups → Create parameter group → select `postgres18` (or your version) → edit parameters, save. Then associate it with your database: modify the DB instance and select the new parameter group. Reboot the DB for changes to take effect.)
10. Create the database. Wait for it to be **Available**.
11. Open the database. In the **Connectivity & security** tab, choose **Cloudshell**, then **Launch Cloudshell**. Enter the password. Then run:

```sql
CREATE DATABASE ecommerce;
\c ecommerce;

CREATE TABLE orders (
    order_id    SERIAL PRIMARY KEY,
    customer_id VARCHAR(20),
    status      VARCHAR(20),
    total_amount NUMERIC(10,2),
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO orders (customer_id, status, total_amount)
VALUES 
    ('CUST-01', 'Placed', 150.00),
    ('CUST-02', 'Shipped', 200.00),
    ('CUST-03', 'Delivered', 75.50),
    ('CUST-04', 'Placed', 300.00);
```

## Step 2: Set Up IAM Roles for DMS

DMS needs a role to write to S3 and to read from the source database.

### 2.1. Role for S3 target access

1. Go to **IAM → Roles → Create role**.
   - **Trusted entity**: AWS service → **DMS**.
   - Attach the managed policy `AmazonS3FullAccess` (or a scoped inline policy for your bucket).
   - Role name: `dms-s3-role`. Copy the ARN.

### 2.2. Role for DMS replication instance

DMS also needs a service-linked role (usually auto‑created when you first create a replication instance). If you haven’t used DMS before, you can create it in the DMS console later or just proceed—DMS will prompt you.

## Step 3: Create S3 Buckets for DMS Output

Create a bucket (or reuse your existing one) for DMS output:

1. **S3 → Create bucket** (e.g., `de-project-dms-output-<account-id>`).
2. Create two folders inside:
   - `full-load/`
   - `cdc/`

DMS will write the initial full load to `full-load/` and ongoing CDC files to `cdc/`.

## Step 4: Create the DMS Replication Instance

1. Open the **AWS DMS** Console. Click **Provisioned instances**
2. Create **replication instance**.
   - **Name**: `dms-replication-instance`.
   - **Instance class**: `dms.t3.small` (smallest, enough for testing).
   - **Engine version**: latest.
   - **Allocated storage**: 50 GB (default).
   - **High Availability**: Dev or test workload (Single-AZ)
   - **VPC**: choose the same VPC as your RDS database.
   - **Publicly accessible**: Yes (so it can connect to S3 and RDS).
3. Wait for it to become **Available** (takes 5–10 minutes).

## Step 5: Create DMS Endpoints

### 5.1. Source endpoint (PostgreSQL)

1. In DMS, go to **Endpoints → Create endpoint**.
   - **Endpoint type**: Source endpoint.
   - **Endpoint identifier**: `source-postgres`.
   - **Source engine**: PostgreSQL.
   - **Access to endpoint database**: Provide access information manually
   - **Server name**: `<your-rds-endpoint>` (e.g., `dms-source-db.xxxx.ap-southeast-2.rds.amazonaws.com`).
   - **Port**: 5432.
   - **User name**: `postgres`, **Password**: your DB password.
   - **SSL mode**: require.
   - **Database**: `ecommerce`.
   - Test endpoint connection (select the replication instance). Fix any security group issues—ensure the replication instance can reach RDS on port 5432.
   - Create Endpoint

### 5.2. Target endpoint (S3)

1. Create another endpoint:
   - **Endpoint type**: Target endpoint.
   - **Endpoint identifier**: `target-s3`.
   - **Target engine**: Amazon S3.
   - **Bucket name**: `<your-bucket>`.
   - **Service access role ARN**: `arn:aws:iam::<account-id>:role/dms-s3-role`
   - **Endpoint settings**: Choose **Editor** and paste:
     ```json
     {
       "DataFormat": "parquet",
       "ParquetVersion": "PARQUET_2_0",
       "CompressionType": "gzip",
       "TimestampColumnName": "cdc_timestamp",
       "EnableStatistics": true,
       "CdcPath": "cdc/CDC_DATE=YYYY-MM-DD"
     }
     ```
     These settings ensure DMS writes Parquet files with a timestamp column for each row and partitions CDC data by date.
   - Test connection.

---

Step 6: Create the DMS Migration Task

1. DMS → Database migration tasks → Create task.
   · Task identifier: dms-orders-cdc-task
   · Replication instance: the instance you created.
   · Source endpoint: source-postgres
   · Target endpoint: target-s3
   · Migration type: Full load, ongoing replication (Full Load + CDC).
   · Task settings: Choose Wizard.
     · Target table preparation mode: Do nothing.
     · Include LOB columns in replication: Limited LOB mode (default).
     · Enable validation: off.
     · Enable CloudWatch logs: on.
   · Table mappings: Add a selection rule:
     · Schema: public
     · Table name: orders
     · Action: Include.
   · Full load settings (optional):
     · Set BucketFolder = full-load in extra connection attributes (under the Advanced section).
   · Create task.
2. The task will start automatically (or click Start). Wait for the full load to complete.
3. Verify: Check your S3 bucket → full-load/ → ecommerce/orders/ — you should see Parquet files containing the initial data.

---

Step 7: Generate CDC Activity

While the DMS task is in "ongoing replication" state, connect to your PostgreSQL database and run some DML operations:

```sql
-- INSERT
INSERT INTO orders (customer_id, status, total_amount) 
VALUES ('CUST-05', 'Placed', 500.00);

-- UPDATE
UPDATE orders SET status = 'Shipped' WHERE order_id = 1;

-- DELETE
DELETE FROM orders WHERE order_id = 4;
```

Within a minute or two, DMS will capture these changes and write new Parquet files to cdc/CDC_DATE=YYYY-MM-DD/. The files contain a column Op (operation type: I, U, D) and the cdc_timestamp you configured.

Exam insight: AWS DMS writes CDC files with operation flags. Parquet files created by DMS include an Op column indicating I (INSERT), U (UPDATE), or D (DELETE) so downstream processing knows how to handle each change.

---

Step 8: Create the Redshift Target Table

We'll use Redshift Serverless (as in your earlier project). If you still have the serverless-taxi-workgroup and serverless-taxi-ns from the data warehousing project, reuse them. Otherwise, create a new one.

1. Redshift Serverless → Workgroup configuration:
   · Reuse the taxi_db database or create a new one (e.g., ecommerce_db).
   · Associate the RedshiftS3ReadRole IAM role (from the warehousing project) for S3 access.
2. Connect via the Redshift Query Editor and run:

```sql
CREATE TABLE orders (
    order_id    INTEGER PRIMARY KEY,
    customer_id VARCHAR(20),
    status      VARCHAR(20),
    total_amount NUMERIC(10,2),
    created_at  TIMESTAMP
);
```

This is the final target table that will stay in sync with your source.

---

Step 9: Build the Glue ETL Job to Process CDC Files

We’ll create a Glue job that reads CDC files from S3, determines the operation type, and applies the changes to Redshift using a MERGE (upsert) pattern. The job will be triggered automatically when new CDC files arrive.

9.1 IAM role for the Glue job

Reuse the GlueLeastPrivilegeRole or create a new role with:

· S3 read access to your DMS output bucket (full-load/ and cdc/).
· Redshift access (attach AmazonRedshiftFullAccess or create an inline policy allowing redshift-data:*).
· Glue service role managed policy.

9.2 PySpark script

Create a Python script (cdc_to_redshift.py) and upload it to s3://<your-bucket>/scripts/:

```python
import sys
from pyspark.sql import SparkSession
from pyspark.sql.functions import col, max as spark_max

def main():
    spark = SparkSession.builder \
        .appName("CDCToRedshift") \
        .config("spark.sql.catalogImplementation", "hive") \
        .enableHiveSupport() \
        .getOrCreate()

    # Read CDC files from S3 (latest partition)
    cdc_path = "s3://<your-bucket>/cdc/"
    cdc_df = spark.read.parquet(cdc_path)

    # Filter for recent changes only (last processed timestamp)
    # You can use the cdc_timestamp column added by DMS
    cdc_df.createOrReplaceTempView("cdc_changes")

    # Use Spark's DataFrame API to write to Redshift via JDBC
    # For INSERT, UPDATE, DELETE, we process each operation type

    # Write inserts and updates to a staging table in Redshift
    # (using a pre-table in S3 and COPY command, then MERGE)

    # Simplified: Write changes to a temporary S3 location
    temp_output = "s3://<your-bucket>/temp/cdc_staging/"
    cdc_df.write.mode("overwrite").parquet(temp_output)

    spark.stop()

if __name__ == "__main__":
    main()
```

Note: The above is a skeleton. A production-ready job would process Op column values and use Redshift MERGE or COPY + staging table. We'll use a simpler approach below.

9.3 Using Glue Studio Visual ETL (simpler)

1. Glue Studio → Visual ETL.
2. Source: S3 → Data Catalog table (run a Glue Crawler on s3://<your-bucket>/cdc/ to catalog the CDC files; call the table cdc_orders).
3. Transform: Use a SQL query or Apply mapping to select rows where Op IN ('I','U') for upserts, and rows where Op = 'D' for deletions.
4. Target: Amazon Redshift → choose a staging table orders_staging (create it in Redshift with the same schema as orders but no primary key).
5. After the Glue job writes to the staging table, use a Redshift post‑action SQL to run:
   ```sql
   DELETE FROM orders USING orders_staging WHERE orders.order_id = orders_staging.order_id AND orders_staging.Op = 'D';
   
   MERGE INTO orders USING orders_staging ON orders.order_id = orders_staging.order_id
   WHEN MATCHED THEN UPDATE SET customer_id = orders_staging.customer_id, status = orders_staging.status, total_amount = orders_staging.total_amount
   WHEN NOT MATCHED THEN INSERT VALUES (orders_staging.order_id, orders_staging.customer_id, orders_staging.status, orders_staging.total_amount, orders_staging.created_at);
   ```
   This handles inserts, updates, and deletes.
6. Save and test the job manually first.

---

Step 10: Automate with S3 Event Notifications and Lambda

Trigger the Glue job whenever new CDC files are written to S3.

1. Lambda function:
   · Runtime: Python 3.9+
   · Permissions: Create a role with glue:StartJobRun and s3:GetObject (and basic Lambda execution).
   · Code:
     ```python
     import boto3
     import json
     
     glue = boto3.client('glue')
     
     def handler(event, context):
         job_name = 'cdc-to-redshift-job'
         response = glue.start_job_run(JobName=job_name)
         print(f"Started Glue job: {job_name}, RunId: {response['JobRunId']}")
         return {"statusCode": 200}
     ```
2. S3 Event Notification:
   · Go to your bucket → Properties → Event notifications → Create event notification.
   · Name: cdc-arrival-trigger
   · Prefix: cdc/
   · Event types: s3:ObjectCreated:*
   · Destination: Lambda function → select the Lambda above.

Now every time DMS writes a new CDC file, the Lambda triggers the Glue job, which applies changes to Redshift.

---

Step 11: End-to-End Test

1. Insert a new row into the source PostgreSQL orders table.
2. Wait 2–5 minutes for DMS to write the CDC file to S3.
3. Verify the S3 cdc/ folder has a new file.
4. The Lambda should trigger the Glue job automatically (check Glue job run status).
5. Query Redshift to see the new row applied.

---

🧹 Cleanup

· DMS: Stop the replication task, delete the endpoints, delete the replication instance.
· RDS: Delete the database (skip final snapshot).
· Redshift Serverless: Delete the workgroup/namespace, or pause to avoid charges.
· Glue job: Stop or delete.
· Lambda: Delete.
· S3 buckets: Empty and delete the DMS output bucket.
· IAM roles: Remove dms-s3-role and any other project‑specific roles.

---

📚 What this project teaches for the DEA‑C01 exam

· DMS: Full load + CDC, replication instances, source/target endpoints, task configuration, S3 target settings (Parquet, partitioning, TimestampColumnName).
· CDC file handling: Understanding the Op column and how to process inserts, updates, and deletes.
· Incremental data processing: Designing pipelines that handle late‑arriving data and deduplication.
· Glue‑Redshift integration: Using Glue to write to Redshift, staging tables, and MERGE statements.
· Event‑driven automation: S3 event notifications → Lambda → Glue job.
· Least privilege IAM: Scoping roles to specific buckets and prefixes.

You’ve now built a complete CDC pipeline—a skill directly tested in scenario‑based exam questions and a fundamental pattern in real‑world data engineering.