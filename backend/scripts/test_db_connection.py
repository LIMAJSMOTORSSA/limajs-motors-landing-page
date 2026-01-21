
import sys
import os

# Add parent dir to path so we can import shared.db
sys.path.append(os.path.join(os.path.dirname(__file__), '..'))

try:
    from shared.db import get_db
    print("✅ Successfully imported shared.db")
except ImportError as e:
    print(f"❌ Failed to import shared.db: {e}")
    sys.exit(1)

def test_connection():
    print("🔄 Testing MongoDB Connection...")
    
    # Check Env var
    mongo_url = os.environ.get('MONGO_DB_URL')
    if not mongo_url:
        print("⚠️  Warning: MONGO_DB_URL environment variable is NOT set.")
        print("   Connection will default to localhost (good for local dev, bad for AWS).")
    else:
        # Mask password for display
        masked_url = mongo_url.replace(mongo_url.split('@')[0].split('//')[1], '****:****') if '@' in mongo_url else mongo_url
        print(f"ℹ️  Using MONGO_DB_URL: {masked_url}")

    try:
        db = get_db()
        print("🔄 Attempting to list collections...")
        cols = db.list_collection_names()
        print(f"✅ Connection Successful! Found {len(cols)} collections.")
        print(f"   Collections: {', '.join(cols)}")
        return True
    except Exception as e:
        print(f"❌ Connection Failed: {e}")
        return False

if __name__ == "__main__":
    success = test_connection()
    sys.exit(0 if success else 1)
