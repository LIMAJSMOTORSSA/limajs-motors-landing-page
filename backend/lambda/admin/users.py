import json
import os
import sys
import boto3
from datetime import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
from shared.response import success, error, get_http_method, get_path_parameters
from shared.db import query_items, scan_items, convert_floats

# Removing boto3 Key/Attr imports as they are no longer used for DB queries
# from boto3.dynamodb.conditions import Key, Attr

# Tables
TABLE_USERS = os.environ.get('TABLE_USERS', 'limajs-users')
TABLE_SUBSCRIPTIONS = os.environ.get('TABLE_SUBSCRIPTIONS', 'limajs-subscriptions')
TABLE_PAYMENTS = os.environ.get('TABLE_PAYMENTS', 'limajs-payments')
TABLE_TRIPS = os.environ.get('TABLE_TRIPS', 'limajs-trips')

# Cognito client (Still Boto3)
cognito = boto3.client('cognito-idp')
USER_POOL_ID = os.environ.get('COGNITO_USER_POOL_ID')

def lambda_handler(event, context):
    """
    Handler pour gestion admin des utilisateurs.
    Routes:
    - GET /admin/users -> Liste tous les utilisateurs
    - GET /admin/users/{userId} -> Détails d'un utilisateur
    - POST /admin/users -> Créer un utilisateur
    - PUT /admin/users/{userId}/suspend -> Suspendre un utilisateur
    - PUT /admin/users/{userId}/activate -> Réactiver un utilisateur
    - GET /admin/users/{userId}/activity -> Activité d'un utilisateur
    """
    http_method = get_http_method(event)
    path = event.get('rawPath') or event.get('path', '')
    path_parameters = get_path_parameters(event)
    
    try:
        if '/suspend' in path and http_method == 'PUT':
            return suspend_user(path_parameters['userId'])
        elif '/activate' in path and http_method == 'PUT':
            return activate_user(path_parameters['userId'])
        elif '/activity' in path and http_method == 'GET':
            return get_user_activity(path_parameters['userId'])
        elif path_parameters.get('userId') and http_method == 'GET':
            return get_user_details(path_parameters['userId'])
        elif http_method == 'GET':
            return list_users(event)
        elif http_method == 'POST':
            return create_user(event)
        else:
            return error(400, "Invalid request")
    except Exception as e:
        print(f"Error: {e}")
        return error(500, str(e))


def create_user(event):
    """Créer un nouvel utilisateur (Cognito + MongoDB profile)."""
    import json
    import uuid
    from shared.db import put_item
    
    try:
        body = json.loads(event.get('body', '{}'))
    except:
        body = event.get('body', {})
        if isinstance(body, str):
            body = json.loads(body)
    
    # Validation
    required = ['email', 'password', 'firstName', 'lastName', 'role']
    for field in required:
        if field not in body:
            return error(400, f"Missing required field: {field}")
    
    email = body['email']
    password = body['password']
    first_name = body['firstName']
    last_name = body['lastName']
    role = body['role']
    phone = body.get('phone', '')
    
    try:
        # Create user in Cognito
        user_attributes = [
            {'Name': 'email', 'Value': email},
            {'Name': 'email_verified', 'Value': 'true'},
            {'Name': 'given_name', 'Value': first_name},
            {'Name': 'family_name', 'Value': last_name},
        ]
        if phone:
            user_attributes.append({'Name': 'phone_number', 'Value': phone})
        
        response = cognito.admin_create_user(
            UserPoolId=USER_POOL_ID,
            Username=email,
            UserAttributes=user_attributes,
            MessageAction='SUPPRESS'
        )
        
        # Set permanent password
        cognito.admin_set_user_password(
            UserPoolId=USER_POOL_ID,
            Username=email,
            Password=password,
            Permanent=True
        )
        
        # Get user sub
        user_sub = None
        for attr in response['User'].get('Attributes', []):
            if attr['Name'] == 'sub':
                user_sub = attr['Value']
                break
        
        if not user_sub:
            user_sub = str(uuid.uuid4())
        
        user_id = f"USER#{user_sub}"
        
        # Create profile in MongoDB
        profile = {
            'userId': user_id,
            'type': 'PROFILE',
            'email': email,
            'firstName': first_name,
            'lastName': last_name,
            'phone': phone,
            'role': role,
            'status': 'ACTIVE',
            'createdAt': datetime.utcnow().isoformat()
        }
        
        put_item(TABLE_USERS, profile)
        
        return success({
            'data': {
                'userId': user_id,
                'email': email,
                'firstName': first_name,
                'lastName': last_name,
                'role': role
            }
        }, "User created successfully")
        
    except cognito.exceptions.UsernameExistsException:
        return error(400, "User with this email already exists")
    except Exception as e:
        print(f"Error creating user: {e}")
        return error(500, str(e))

def list_users(event):
    """Liste tous les utilisateurs avec pagination."""
    query_params = event.get('queryStringParameters') or {}
    role_filter = query_params.get('role')  # PASSENGER, DRIVER, ADMIN
    limit = int(query_params.get('limit', 50))
    
    try:
        # Récupérer les utilisateurs depuis Cognito
        params = {
            'UserPoolId': USER_POOL_ID,
            'Limit': limit
        }
        
        if role_filter:
            params['Filter'] = f'custom:role = "{role_filter}"'
        
        response = cognito.list_users(**params)
        
        users = []
        for user in response.get('Users', []):
            user_data = {
                'username': user['Username'],
                'status': user['UserStatus'],
                'enabled': user['Enabled'],
                'createdAt': user['UserCreateDate'].isoformat(),
                'lastModified': user['UserLastModifiedDate'].isoformat()
            }
            
            # Extraire attributs
            for attr in user.get('Attributes', []):
                if attr['Name'] == 'email':
                    user_data['email'] = attr['Value']
                elif attr['Name'] == 'custom:role':
                    user_data['role'] = attr['Value']
                elif attr['Name'] == 'name':
                    user_data['name'] = attr['Value']
                elif attr['Name'] == 'sub':
                    user_data['userId'] = f"USER#{attr['Value']}"
            
            users.append(user_data)
        
        return success({
            'users': users,
            'count': len(users)
        })
        
    except Exception as e:
        print(f"Error listing users: {e}")
        return error(500, str(e))

def get_user_details(user_id):
    """Détails complets d'un utilisateur (Cognito + DynamoDB)."""
    full_user_id = f"USER#{user_id}" if not user_id.startswith('USER#') else user_id
    
    # Profil DynamoDB -> MongoDB
    from shared.db import get_item
    profile = get_item(TABLE_USERS, {'userId': full_user_id, 'type': 'PROFILE'})
    
    # Abonnement actif
    # Key('userId').eq ... -> {'userId': ...}
    subscriptions = query_items(
        TABLE_SUBSCRIPTIONS,
        {'userId': full_user_id, 'status': 'ACTIVE'}
    )
    
    # Paiements récents
    payments = scan_items(
        TABLE_PAYMENTS,
        {'userId': full_user_id},
        limit=10
    )
    # Scan logic in db.py passes filter_expression as key_condition to query_items, 
    # and query_items uses .find(query). So strictly speaking scan_items is same as query_items now.
    
    return success({
        'profile': profile,
        'activeSubscription': subscriptions[0] if subscriptions else None,
        'recentPayments': payments
    })

def suspend_user(user_id):
    """Suspendre un utilisateur (désactiver dans Cognito)."""
    try:
        # Trouver l'username Cognito
        full_user_id = f"USER#{user_id}" if not user_id.startswith('USER#') else user_id
        sub = user_id.replace('USER#', '')
        
        # Désactiver dans Cognito
        cognito.admin_disable_user(
            UserPoolId=USER_POOL_ID,
            Username=sub
        )
        
        # Mettre à jour le profil DynamoDB -> MongoDB
        from shared.db import update_item
        update_item(
            TABLE_USERS,
            {'userId': full_user_id, 'type': 'PROFILE'},
            {'status': 'SUSPENDED', 'suspendedAt': datetime.utcnow().isoformat()}
        )
        
        return success({'userId': full_user_id}, "User suspended successfully")
        
    except Exception as e:
        print(f"Error suspending user: {e}")
        return error(500, str(e))

def activate_user(user_id):
    """Réactiver un utilisateur suspendu."""
    try:
        full_user_id = f"USER#{user_id}" if not user_id.startswith('USER#') else user_id
        sub = user_id.replace('USER#', '')
        
        # Réactiver dans Cognito
        cognito.admin_enable_user(
            UserPoolId=USER_POOL_ID,
            Username=sub
        )
        
        # Mettre à jour DynamoDB
        from shared.db import update_item
        update_item(
            TABLE_USERS,
            {'userId': full_user_id, 'type': 'PROFILE'},
            {'status': 'ACTIVE', 'reactivatedAt': datetime.utcnow().isoformat()}
        )
        
        return success({'userId': full_user_id}, "User activated successfully")
        
    except Exception as e:
        print(f"Error activating user: {e}")
        return error(500, str(e))

def get_user_activity(user_id):
    """Historique d'activité d'un utilisateur."""
    full_user_id = f"USER#{user_id}" if not user_id.startswith('USER#') else user_id
    
    # Voyages (en tant que passager)
    trips_as_passenger = scan_items(
        TABLE_TRIPS,
        {'passengerId': full_user_id}
    )
    
    # Voyages (en tant que chauffeur)
    # Complex query: driverId=... AND timestamp exists.
    # Mongo: {'driverId': ..., 'timestamp': {'$exists': True}}
    trips_as_driver = scan_items(
        TABLE_TRIPS,
        {'driverId': full_user_id, 'timestamp': {'$exists': True}}
    )
    
    # Paiements
    payments = scan_items(
        TABLE_PAYMENTS,
        {'userId': full_user_id}
    )
    
    return success({
        'tripsAsPassenger': len(trips_as_passenger),
        'tripsAsDriver': len(trips_as_driver),
        'totalPayments': len(payments),
        'recentActivity': {
            'trips': trips_as_passenger[:5],
            'payments': payments[:5]
        }
    })
