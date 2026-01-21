import json
import os
import sys

sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
from shared.response import success, error, get_user_claims, get_user_sub
from shared import db

TABLE_USERS = os.environ.get('TABLE_USERS', 'limajs-users')

def lambda_handler(event, context):
    try:
        # Get user sub from JWT claims (supports both REST API and HTTP API)
        user_sub = get_user_sub(event)
        
        if not user_sub:
            return error(401, "Unauthorized: No user identity found")

        user_id = f"USER#{user_sub}"

        # Use new generic get_item which expects simple dict key
        # Note: keys for users table are implicit. Assuming 'userId' is the key we want to query by.
        # But wait, DynamoDB table had composite key (userId, type). 
        # In get_profile.py original code: Key={'userId': {'S': user_id}, 'type': {'S': 'PROFILE'}}
        # So we must query by both fields in MongoDB too to find the exact document.
        
        item = db.get_item(
            TABLE_USERS,
            {'userId': user_id, 'type': 'PROFILE'}
        )
        
        if not item:
            return error(404, "Profile not found")

        # Mongo items are already python dicts, no ['S'] needed
        # item['userId'] might still have USER# prefix, we remove it for frontend if needed
        profile = {
            'id': item['userId'].replace('USER#', ''),
            'email': item.get('email'),
            'name': item.get('name'),
            'role': item.get('role', 'PASSENGER'),
            'isActive': item.get('isActive', False)
        }
        
        return success(profile, "Profile retrieved successfully")

    except Exception as e:
        print(f"Error: {e}")
        return error(500, str(e))
