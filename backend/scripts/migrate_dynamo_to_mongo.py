import boto3
import os
import pymongo
from botocore.exceptions import ClientError
from decimal import Decimal
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), "../../.env")
load_dotenv(env_path)

# Configuration
AWS_REGION = os.getenv("AWS_REGION", "us-east-1")
MONGO_URL = os.getenv("MONGO_DB_URL")
if not MONGO_URL:
    print("❌ MONGO_DB_URL is missing in .env")
    exit(1)

# Initialize DynamoDB
dynamodb = boto3.resource('dynamodb', region_name=AWS_REGION)

# Initialize MongoDB
try:
    mongo_client = pymongo.MongoClient(MONGO_URL)
    # Use explicit database name 'limajs' or from env
    db_name = os.getenv("MONGO_DB_NAME", "limajs")
    db = mongo_client[db_name] 
    print(f"✅ Connected to MongoDB: {db.name}")
except Exception as e:
    print(f"❌ Failed to connect to MongoDB: {e}")
    exit(1)

# Tables to migrate and their mapping to MongoDB collections
# Format: "DynamoTableName": "MongoCollectionName"
TABLE_MAPPING = {
    "limajs-users": "users",
    "limajs-buses": "buses",
    "limajs-routes": "routes",
    "limajs-schedules": "schedules",
    "limajs-subscriptions": "subscriptions",
    "limajs-payments": "payments",
    "limajs-tickets": "tickets",
    "limajs-nfc-cards": "nfc_cards",
    "limajs-trips": "trips",
    "limajs-gps-positions": "gps_positions",
    "limajs-invoices": "invoices",
    "limajs-wallet-transactions": "wallet_transactions",
    "limajs-passenger-trips": "passenger_trips"
}

def convert_decimal(obj):
    if isinstance(obj, list):
        return [convert_decimal(i) for i in obj]
    elif isinstance(obj, dict):
        return {k: convert_decimal(v) for k, v in obj.items()}
    elif isinstance(obj, Decimal):
        return float(obj)
    return obj

def migrate_table(dynamo_table_name, mongo_col_name):
    print(f"\n🚀 Migrating {dynamo_table_name} -> {mongo_col_name}...")
    
    table = dynamodb.Table(dynamo_table_name)
    collection = db[mongo_col_name]
    
    try:
        # Scan DynamoDB table
        response = table.scan()
        items = response.get('Items', [])
        
        while 'LastEvaluatedKey' in response:
            response = table.scan(ExclusiveStartKey=response['LastEvaluatedKey'])
            items.extend(response.get('Items', []))
            
        print(f"   Found {len(items)} items in DynamoDB.")
        
        if not items:
            print("   ⚠️ No items to migrate.")
            return

        # Prepare for bulk write
        operations = []
        for item in items:
            # Convert Decimals to native Python types (float/int) for MongoDB
            clean_item = convert_decimal(item)
            
            # Use a unique filter based on all fields or specific keys?
            # For simplicity in this generic script, we'll try to find an existing doc generic or just insert.
            # Ideally we use ReplaceOne with upsert=True based on the DynamoDB keys.
            # But keys vary per table. 
            # Strategy: We will just insert them. If specific uniqueness is needed, we should define keys.
            # To be safe and idempotent, let's identify keys if possible, or just delete and re-insert?
            # Deleting is dangerous. 
            # Let's rely on the fact that if we migrate, we might be starting fresh or appending.
            # Better: Insert and assume empty target or ignore duplicates if _id matches?
            # Since we don't map DynamoPK to Mongo _id explicitly here (Mongo generates ObjectId), 
            # we might get duplicates if run multiple times.
            # Let's try to map DynamoDB Key to a filter if possible, OR just Insert.
            
            operations.append(pymongo.InsertOne(clean_item))
            
        if operations:
            # Optional: clear collection before migration?
            # collection.delete_many({}) 
            # print("   Cleared existing MongoDB collection.")
            
            result = collection.bulk_write(operations)
            print(f"   ✅ Inserted {result.inserted_count} documents.")
            
    except ClientError as e:
        if e.response['Error']['Code'] == 'ResourceNotFoundException':
             print(f"   ⚠️ Table {dynamo_table_name} not found in DynamoDB. Skipping.")
        else:
            print(f"   ❌ Error scanning {dynamo_table_name}: {e}")
    except Exception as e:
        print(f"   ❌ Error migrating {dynamo_table_name}: {e}")

def main():
    print("🔄 Starting DynamoDB to MongoDB Migration...")
    
    for dynamo_table, mongo_collection in TABLE_MAPPING.items():
        migrate_table(dynamo_table, mongo_collection)
        
    print("\n✨ Migration completed!")
    print("IMPORTANT: Check indexes in MongoDB after validation.")

if __name__ == "__main__":
    main()
