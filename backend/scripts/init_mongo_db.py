import os
import pymongo
from dotenv import load_dotenv

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), "../../.env")
load_dotenv(env_path)

# Configuration
MONGO_URL = os.getenv("MONGO_DB_URL")
if not MONGO_URL:
    print("❌ MONGO_DB_URL is missing in .env")
    exit(1)

def init_db():
    print("🔄 Connecting to MongoDB...")
    try:
        client = pymongo.MongoClient(MONGO_URL)
        db_name = os.getenv("MONGO_DB_NAME", "limajs")
        db = client[db_name]
        print(f"✅ Connected to database: {db.name}")
    except Exception as e:
        print(f"❌ Failed to connect: {e}")
        exit(1)

    # Define Collections and Indexes
    # Format: "collection_name": [ (index_fields, unique/options) ]
    collections = {
        "users": [
            ([("userId", pymongo.ASCENDING)], {"unique": True}),
            ([("email", pymongo.ASCENDING)], {"unique": True, "sparse": True}),
            ([("type", pymongo.ASCENDING)], {}), # GSI for listing profiles
        ],
        "buses": [
            ([("busId", pymongo.ASCENDING)], {"unique": True}),
            ([("status", pymongo.ASCENDING), ("type", pymongo.ASCENDING)], {}), # Filtering buses
        ],
        "routes": [
            ([("routeId", pymongo.ASCENDING)], {"unique": True}),
            ([("type", pymongo.ASCENDING)], {}),
        ],
        "schedules": [
            ([("scheduleId", pymongo.ASCENDING)], {"unique": True}),
            ([("routeId", pymongo.ASCENDING), ("type", pymongo.ASCENDING)], {}), # Filtering by route
        ],
        "subscriptions": [
            ([("subscriptionId", pymongo.ASCENDING)], {"unique": True}),
            ([("userId", pymongo.ASCENDING)], {}), # User's subscriptions
            ([("status", pymongo.ASCENDING), ("endDate", pymongo.ASCENDING)], {}), # For reminders/expiry check
        ],
        "payments": [
            ([("paymentId", pymongo.ASCENDING)], {"unique": True}),
            ([("userId", pymongo.ASCENDING)], {}), # User history
            ([("status", pymongo.ASCENDING)], {}), # Admin reports
            ([("type", pymongo.ASCENDING)], {}), 
        ],
        "tickets": [
            ([("ticketId", pymongo.ASCENDING)], {"unique": True}),
            ([("userId", pymongo.ASCENDING)], {}),
        ],
        "nfc_cards": [
            ([("cardId", pymongo.ASCENDING)], {"unique": True}),
            ([("nfcUidHash", pymongo.ASCENDING)], {"unique": True}),
        ],
        "trips": [
            ([("tripId", pymongo.ASCENDING)], {"unique": True}),
            ([("routeId", pymongo.ASCENDING)], {}),
            ([("status", pymongo.ASCENDING)], {}),
            ([("timestamp", pymongo.ASCENDING)], {}), # Reports
            ([("startTime", pymongo.ASCENDING)], {}), # Reports
        ],
        "passenger_trips": [
            ([("tripId", pymongo.ASCENDING)], {}),
            ([("passengerId", pymongo.ASCENDING), ("date", pymongo.DESCENDING)], {}), # History sorted by date
        ],
        "invoices": [
            ([("invoiceId", pymongo.ASCENDING)], {"unique": True}),
            ([("userId", pymongo.ASCENDING)], {}),
        ],
        "gps_positions": [
            ([("busId", pymongo.ASCENDING)], {}),
            ([("timestamp", pymongo.DESCENDING)], {}),
        ],
        "websocket_connections": [
            ([("connectionId", pymongo.ASCENDING)], {"unique": True}),
            ([("routeId", pymongo.ASCENDING)], {}), # For broadcasting
        ]
    }

    print("\n🚀 Initializing Collections and Indexes...")
    
    for col_name, indexes in collections.items():
        print(f"   📂 Collection: {col_name}")
        collection = db[col_name]
        
        # Create collection implicitly by inserting a dummy doc? 
        # No, create_index is enough to create the collection.
        # But if we want to ensure it shows up empty, we can create explicitly.
        # db.create_collection(col_name) # Fails if exists
        
        for idx_fields, options in indexes:
            try:
                name = collection.create_index(idx_fields, **options)
                print(f"      ➕ Index created: {name}")
            except Exception as e:
                print(f"      ⚠️ Failed to create index {idx_fields}: {e}")

    print("\n✨ Database initialization completed!")
    print(f"✅ Created/Verified {len(collections)} collections with indexes.")

if __name__ == "__main__":
    init_db()
