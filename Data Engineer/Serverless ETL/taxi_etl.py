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
    raw_df = spark.table("taxi_db.raw_taxi")

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
    output_path = "s3://serverless-data-lake-project/processedData/taxi_agg/"
    agg_df.write \
        .mode("overwrite") \
        .format("parquet") \
        .option("path", output_path) \
        .saveAsTable("taxi_db.processed_taxi_hourly") # also creates/updates table in Glue Catalog

    spark.stop()

if __name__ == "__main__":
    main()