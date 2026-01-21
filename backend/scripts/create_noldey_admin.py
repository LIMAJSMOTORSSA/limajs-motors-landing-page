
import boto3
import os
import pymongo
from dotenv import load_dotenv
import time

# Load environment variables
env_path = os.path.join(os.path.dirname(__file__), "../../.env")
load_dotenv(env_path)

# Configuration
REGION = 'us-east-1'
MONGO_URL = os.getenv("MONGO_DB_URL")
if not MONGO_URL:
    print("❌ MONGO_DB_URL is missing in .env")
    exit(1)

# User Details
USER_EMAIL = "noldey.jean@limajs.com"
USER_PWD = "LimajsAdmin2024!"
USER_FIRST = "Noldey"
USER_LAST = "Jean"
USER_ROLE = "ADMIN"

def get_mongo_db():
    client = pymongo.MongoClient(MONGO_URL)
    db_name = os.getenv("MONGO_DB_NAME", "limajs")
    return client[db_name]

def find_user_pool(cognito):
    """Trouve le User Pool LimaJS"""
    pools = cognito.list_user_pools(MaxResults=60)
    for pool in pools['UserPools']:
        if 'limajs' in pool['Name'].lower() or 'motor' in pool['Name'].lower():
            return pool['Id']
    return None

def main():
    print(f"🚀 Creating Admin User: {USER_FIRST} {USER_LAST} ({USER_EMAIL})")
    
    cognito = boto3.client('cognito-idp', region_name=REGION)
    pool_id = find_user_pool(cognito)
    
    if not pool_id:
        print("❌ User Pool not found in AWS.")
        return

    print(f"✅ User Pool Found: {pool_id}")

    # 1. Create in Cognito
    user_sub = None
    try:
        # Check if exists
        try:
            user = cognito.admin_get_user(UserPoolId=pool_id, Username=USER_EMAIL)
            print("⚠️ User already exists in Cognito.")
            for attr in user['UserAttributes']:
                if attr['Name'] == 'sub':
                    user_sub = attr['Value']
                    break
        except cognito.exceptions.UserNotFoundException:
            # Create
            print("Creating user in Cognito...")
            attributes = [
                {'Name': 'email', 'Value': USER_EMAIL},
                {'Name': 'email_verified', 'Value': 'true'},
                {'Name': 'given_name', 'Value': USER_FIRST},
                {'Name': 'family_name', 'Value': USER_LAST}
            ]
            # Note: custom:role might fail if not defined in pool. We'll verify.
            
            resp = cognito.admin_create_user(
                UserPoolId=pool_id,
                Username=USER_EMAIL,
                UserAttributes=attributes,
                TemporaryPassword=USER_PWD,
                MessageAction='SUPPRESS'
            )
            print("✅ User created in Cognito.")
            
            # Set Password
            cognito.admin_set_user_password(
                UserPoolId=pool_id,
                Username=USER_EMAIL,
                Password=USER_PWD,
                Permanent=True
            )
            
            # Get SUB
            # The response from create_user contains Attributes
            for attr in resp['User']['Attributes']:
                if attr['Name'] == 'sub':
                    user_sub = attr['Value']
                    break

    except Exception as e:
        print(f"❌ Error in Cognito operations: {e}")
        # Continue to try DB if we can find sub? No, need sub.
        return

    if not user_sub:
        print("❌ Could not retrieve User SUB (UUID) from Cognito.")
        return

    print(f"🔑 User UUID: {user_sub}")

    # 2. Insert into MongoDB
    try:
        db = get_mongo_db()
        users_col = db['users']
        
        full_user_id = f"USER#{user_sub}"
        
        item = {
            'userId': full_user_id,
            'type': 'PROFILE',
            'email': USER_EMAIL,
            'firstName': USER_FIRST,
            'lastName': USER_LAST,
            'role': USER_ROLE,
            'status': 'ACTIVE',
            'createdAt': datetime.now().isoformat(),
            'updatedAt': datetime.now().isoformat()
        }
        
        # Upsert
        users_col.update_one(
            {'userId': full_user_id, 'type': 'PROFILE'},
            {'$set': item},
            upsert=True
        )
        print(f"✅ User profile inserted/updated in MongoDB: {full_user_id}")
        
    except Exception as e:
        print(f"❌ Error updating MongoDB: {e}")

if __name__ == "__main__":
    from datetime import datetime
    main()
