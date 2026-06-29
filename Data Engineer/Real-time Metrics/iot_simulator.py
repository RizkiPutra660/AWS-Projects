import boto3
import json
import time
import random
from datetime import datetime, timezone

kinesis = boto3.client('kinesis', region_name='ap-southeast-2')

STREAM_NAME = "iot-data-stream"

while True:
    record = {
        'device_id': f'sensor-{random.randint(1, 10)}',
        'temperature': round(random.uniform(20.0, 30.0), 2),
        'humidity': round(random.uniform(40.0, 70.0), 2),
        'timestamp': datetime.now(timezone.utc).isoformat()
    }
    try:
        response = kinesis.put_record(
            StreamName = STREAM_NAME,
            Data=json.dumps(record),
            PartitionKey=str(record['device_id'])
        )
        print(f"Sent: {record} - ShardId: {response['ShardId']}")
    except Exception as e:
        print(f"Error: {e}")
    time.sleep(1)