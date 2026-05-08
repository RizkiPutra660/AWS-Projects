# Data Warehouse

The Data Warehousing project deep dives into analytical data stores. We’ll build two Amazon Redshift warehouses (serverless and provisioned), a DynamoDB NoSQL backend, and an RDS relational database. This lets us compare architectures firsthand.

This project gives knowledge of Redshift architecture, distribution styles, sort keys, DynamoDB key design, and relational modeling.

## Part 1: Set up the dataset in S3

We’ll use the New York City Taxi Trip Record Data (Yellow Taxi, March 2026 in Parquet format). It’s structured, reasonably large, and great for analytics.

1. **Download a sample file** (or use a publicly hosted one).  
   To keep things simple, we’ll use a pre‑hosted public Parquet file.  
   Go to the AWS Console → **S3** → your bucket (`de-project-data-lake-...`).  
   Create a folder named `taxi-data/`.

2. **Upload a sample Parquet file** to `s3://your-bucket/taxi-data/`.  
   You can get a small file from the NYC TLC site:  
   [https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page](https://www.nyc.gov/site/tlc/about/tlc-trip-record-data.page)


## Part 2: IAM roles for Redshift

Redshift needs to access S3 to load data. We’ll create a role that both the serverless and provisioned clusters can assume.

1. Go to **IAM** → **Roles** → **Create role**.
   - Trusted entity type: **AWS service** → **Redshift** → **Redshift - Customizable** (this allows Redshift to assume the role) → Next.
2. Attach the managed policy **`AmazonS3ReadOnlyAccess`** (or create an inline policy scoped to your bucket – the managed one is fine for learning). → Next.
3. Role name: `RedshiftS3ReadRole`.  
   Create role.  
   Copy the **ARN** of the role.

---

## Part 3: Redshift Serverless warehouse

### 3.1 Create the workgroup and namespace
1. Open the **Amazon Redshift** console → **Redshift Serverless** → **Create workgroup**.
2. **Workgroup configuration**:
   - Workgroup name: `serverless-taxi-workgroup`.
   - Base capacity: **8 RPU** (minimum, fine for testing).
   - Network and security: choose **Default VPC** and **default security group** (or create a simple one allowing inbound TCP/5439 from your IP if you want to connect later; for the query editor it’s not needed).
3. **Namespace**: create a new namespace.
   - Namespace name: `serverless-taxi-ns`.
   - Database name: `taxi_db`.
   - Admin user name: `admin`, admin password: set a password that you’ll remember.
   - **Associate IAM roles**: select the `RedshiftS3ReadRole` you created.
   - Leave encryption and audit logging default.
4. Click **Create workgroup**.

Wait a few minutes until the workgroup status becomes **Available**.

### 3.2 Load the taxi data via the Query Editor
1. In the Redshift Serverless dashboard, your workgroup will appear. Click on it, then click **Query data** (or go to **Query Editor v2**).
3. You may need to configure a **connection**. In the Query Editor screen, choose the workgroup, database `taxi_db`, user `admin`, and enter the password. Save.
2. First, create a schema and a table optimized for analytics.  
   The NYC taxi data includes columns: `VendorID`, `tpep_pickup_datetime`, `tpep_dropoff_datetime`, `passenger_count`, `trip_distance`, `PULocationID`, `DOLocationID`, `fare_amount`, etc.  
   We’ll create a table with **distribution key** (DISTKEY) on `PULocationID` (pickup location) and **sort key** on `tpep_pickup_datetime` (time‑based queries are common). This shows you the impact of key choices.

   Run the following SQL in the query editor:
   ```sql
    CREATE SCHEMA taxi;

    CREATE TABLE taxi.yellow_trips (
        vendorid                    BIGINT,
        tpep_pickup_datetime        TIMESTAMP,
        tpep_dropoff_datetime       TIMESTAMP,
        passenger_count             BIGINT,
        trip_distance               DOUBLE PRECISION,
        ratecodeid                  BIGINT,
        store_and_fwd_flag          VARCHAR(1),
        pulocationid                BIGINT,
        dolocationid                BIGINT,
        payment_type                BIGINT,
        fare_amount                 DOUBLE PRECISION,
        extra                       DOUBLE PRECISION,
        mta_tax                     DOUBLE PRECISION,
        tip_amount                  DOUBLE PRECISION,
        tolls_amount                DOUBLE PRECISION,
        improvement_surcharge       DOUBLE PRECISION,
        total_amount                DOUBLE PRECISION,
        congestion_surcharge        DOUBLE PRECISION,
        airport_fee                 DOUBLE PRECISION,
        cbd_congestion_fee          DOUBLE PRECISION
    )
    DISTKEY(pulocationid)
    SORTKEY(tpep_pickup_datetime);
   ```

3. Load data with the COPY command.  
   Replace `<your-bucket>` and `<your-aws-region>` (e.g., `ap-southeast-2`). The IAM role ARN you copied.
   ```sql
   COPY taxi.yellow_trips
   FROM 's3://<your-bucket>/taxi-data/'
   IAM_ROLE 'arn:aws:iam::<account-id>:role/RedshiftS3ReadRole'
   FORMAT AS PARQUET;
   ```
   *Note: If you used the csv.gz file instead, use `FORMAT AS CSV` with `gzip` and `REGION` parameter.*  
   This will load a few million rows in a minute or two.

4. Verify: `SELECT COUNT(*) FROM taxi.yellow_trips;`

### 3.3 Query and observe performance
Run analytical queries that leverage the sort key and distribution style:
```sql
-- Total fare by pickup location, January 2024
SELECT pulocationid, SUM(fare_amount) total_fare
FROM taxi.yellow_trips
WHERE tpep_pickup_datetime BETWEEN '2026-01-01' AND '2026-12-31'
GROUP BY pulocationid
ORDER BY total_fare DESC
LIMIT 10;
```
Examine the query plan: in the Query Editor, highlight the query and click **Explain** to see how it uses the SORTKEY and DISTKEY. This is gold for the exam.

**Pause the serverless workgroup** when not querying to avoid RPU charges (you can set it to pause after idle, but we’ll keep it running for the comparison).

---

## Part 4: Redshift provisioned cluster

### 4.1 Create a small cluster
1. In the Redshift console, switch from **Serverless** to **Provisioned** (top left toggle).
2. Click **Create cluster**.
   - Cluster identifier: `provisioned-taxi-cluster`.
   - Node type: **ra3.large** (cheapest dense compute). Choose **1 node** (or 2 if you want to see distribution, but 1 node is fine).
   - Database Configurations: Admin username : `admin`, password: Manually add the admin password.
   - **Associated IAM roles**: add `RedshiftS3ReadRole`.
3. Create cluster. Wait about 5–10 minutes for it to become available.

### 4.2 Load the same dataset
1. Open the Query Editor v2 and add a new connection to the provisioned cluster.
2. Run the same table creation and COPY command (same schema, same table definition).  
   ```sql
   -- same DDL and COPY as before
   ```
3. Verify row count matches.

### 4.3 Compare query performance
Run the same analytical query from above. Note how the provisioned cluster with a single ra3.large handles it. On a tiny 1-node cluster, query times might be similar to serverless for this dataset. Serverless scales automatically for unpredictable workloads; provisioned clusters require capacity planning and offer reserved instance pricing.

After testing, **you can delete the provisioned cluster** (or stop it) to save cost. We don’t need it for the rest of the project.


## Part 5: DynamoDB single-table design (e-commerce orders)

This simulates a NoSQL backend for an order system. We’ll design one table that stores orders and their items using **composite keys** and **overloaded attributes**. This is a classic DynamoDB advanced pattern.

### 5.1 Create the table
1. Go to **DynamoDB** → **Create table**.
   - Table name: `ECommerceOrders`
   - Partition key: `PK` (String)
   - Sort key: `SK` (String)
   - Leave default settings for capacity mode (On-demand) and encryption.  
   - Create table.

### 5.2 Define the data model
We’ll store two types of entities in the same table:
- **Order** – partition key `ORDER#<orderId>`, sort key `METADATA#<timestamp>`
- **Order Item** – partition key `ORDER#<orderId>`, sort key `ITEM#<productId>`

This allows retrieving an entire order (header + items) with a single query on `PK = ORDER#<orderId>`.

Attributes:
- For Order: `status`, `customerId`, `totalAmount`, `createdAt`, etc.
- For Item: `productName`, `quantity`, `price`.

### 5.3 Insert sample data using the console or SDK
From the DynamoDB console → **Explore items** → choose the `ECommerceOrders` table → **Create item**. Add an order and a few items manually.

**Example Order item** (in JSON view):
```json
{
  "PK": { "S": "ORDER#1001" },
  "SK": { "S": "METADATA#2024-01-15T10:00:00" },
  "status": { "S": "Placed" },
  "customerId": { "S": "CUST-55" },
  "totalAmount": { "N": "120.50" },
  "createdAt": { "S": "2024-01-15T10:00:00" },
  "entityType": { "S": "Order" }
}
```
**Example Item**:
```json
{
  "PK": { "S": "ORDER#1001" },
  "SK": { "S": "ITEM#B001" },
  "productName": { "S": "Widget" },
  "quantity": { "N": "2" },
  "price": { "N": "10.00" },
  "entityType": { "S": "Item" }
}
```
Add another item with `SK`: `ITEM#B002`.

### 5.4 Query the order with all its line items
Use the DynamoDB console’s **PartiQL editor** or the “Explore items” scan. For PartiQL:
```sql
SELECT * FROM "ECommerceOrders" WHERE PK = 'ORDER#1001'
```
This returns the order metadata and all items; you can filter by `begins_with(SK, 'ITEM#')` in application code.

This single-table design demonstrates NoSQL modeling.


## Part 6: RDS relational schema

We’ll build an equivalent normalized schema using Amazon RDS (PostgreSQL or MySQL). This highlights the differences.

### 6.1 Create an RDS instance (free tier)
1. Go to **RDS** → **Create database**.
   - Engine: PostgreSQL (or MySQL). Choose **PostgreSQL** for ANSI SQL.
   - Choose a database creation method: **Easy Create**.
   - DB instance size: Sandbox
   - DB instance identifier: `ecommerce-orders-db`.
   - Master username: `postgres`, master password: set a password.
   - Leave other defaults. **Create database**. Wait ~5–10 minutes.

### 6.2 Connect and create schema
Connect via a tool like `psql` in CloudShell.

From CloudShell:
```bash
sudo yum install -y postgresql
psql --host=<rds-endpoint> --port=5432 --username=postgres --password
```
Enter password. Then run:
```sql
CREATE DATABASE ecommerce;
\c ecommerce;

CREATE TABLE orders (
    order_id    INTEGER PRIMARY KEY,
    customer_id VARCHAR(20),
    status      VARCHAR(20),
    total_amount NUMERIC(10,2),
    created_at  TIMESTAMP
);

CREATE TABLE order_items (
    order_item_id SERIAL PRIMARY KEY,
    order_id      INTEGER REFERENCES orders(order_id),
    product_id    VARCHAR(10),
    product_name  VARCHAR(100),
    quantity      INTEGER,
    price         NUMERIC(10,2)
);

INSERT INTO orders VALUES (1001, 'CUST-55', 'Placed', 120.50, '2024-01-15 10:00:00');
INSERT INTO order_items (order_id, product_id, product_name, quantity, price)
VALUES (1001, 'B001', 'Widget', 2, 10.00),
       (1001, 'B002', 'Gadget', 1, 100.50);
```

### 6.3 Run a join query
```sql
SELECT o.order_id, o.customer_id, oi.product_name, oi.quantity, oi.price
FROM orders o
JOIN order_items oi ON o.order_id = oi.order_id;
```

Compare this to the DynamoDB single-query access: in RDS you join tables; in DynamoDB you fetch all with a single PK query. The exam expects you to know when normalizing is beneficial vs. denormalizing for performance.

---

## 🧹 Cleanup
- **Redshift Serverless**: open the workgroup and namespace, delete both (or just the workgroup). The namespace can be deleted after.
- **Redshift provisioned cluster**: delete the cluster (skip final snapshot).
- **RDS instance**: delete the database, disable automated backups and skip final snapshot.
- **DynamoDB table**: delete `ECommerceOrders`.
- **S3 bucket**: delete the `taxi-data/` folder or empty the bucket if not needed.
- **IAM role `RedshiftS3ReadRole`**: delete it.

---

## 📚 What we learn
- **Redshift architecture**: DISTKEY, SORTKEY, how they affect query plans and performance.
- **Serverless vs. Provisioned**: scaling, cost model, when to choose each.
- **Loading data**: COPY from S3 with IAM roles, Parquet columnar format optimizations.
- **DynamoDB single-table design**: composite keys, overloading attributes, query patterns.
- **RDS vs. DynamoDB decision making**: normalization vs. denormalization, joins vs. single-table retrieval, use cases for OLTP vs. NoSQL key-value.
- **IAM role association** for services to access S3 – a recurring exam theme.