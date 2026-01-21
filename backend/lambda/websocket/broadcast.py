import json
import os
import sys
import boto3

sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
from shared.db import query_items, scan_items
from shared.db import query_items, scan_items

TABLE_CONNECTIONS = os.environ.get('TABLE_CONNECTIONS', 'limajs-websocket-connections')
WEBSOCKET_API_ENDPOINT = os.environ.get('VITE_WEBSOCKET_URL', '').replace('wss://', 'https://')

# Client API Gateway Management pour envoyer messages
apigw_management = None

def get_apigw_client(event):
    """Créer le client API Gateway Management API."""
    global apigw_management
    if not apigw_management:
        domain = event.get('requestContext', {}).get('domainName')
        stage = event.get('requestContext', {}).get('stage')
        endpoint = f"https://{domain}/{stage}"
        apigw_management = boto3.client('apigatewaymanagementapi', endpoint_url=endpoint)
    return apigw_management

def lambda_handler(event, context):
    """
    Broadcast GPS updates aux clients connectés.
    Déclenché par EventBridge ou manuellement.
    """
    try:
        # Parse l'event (peut venir d'EventBridge ou direct)
        if 'detail' in event:
            # EventBridge event
            gps_data = event['detail']
        else:
            # Direct invocation
            gps_data = json.loads(event.get('body', '{}'))
        
        bus_id = gps_data.get('busId')
        route_id = gps_data.get('routeId')
        
        if not bus_id or not route_id:
            print("❌ Missing busId or routeId")
            return {'statusCode': 400}
        
        # Récupérer toutes les connexions abonnées à cette route
        # Récupérer toutes les connexions abonnées à cette route
        connections = query_items(
            TABLE_CONNECTIONS,
            {'routeId': route_id}
        )
        
        if not connections:
            print(f"ℹ️ Aucune connexion pour route {route_id}")
            return {'statusCode': 200, 'body': 'No subscribers'}
        
        # Préparer le message
        message = {
            'action': 'gps_update',
            'data': {
                'busId': bus_id,
                'routeId': route_id,
                'latitude': gps_data.get('latitude'),
                'longitude': gps_data.get('longitude'),
                'speed': gps_data.get('speed', 0),
                'timestamp': gps_data.get('timestamp')
            }
        }
        
        print(f"📡 Broadcasting à {len(connections)} connexions")
        
        # Broadcast réel aux clients WebSocket
        from shared.db import delete_item
        
        # Obtenir endpoint depuis environnement
        api_id = os.environ.get('WEBSOCKET_API_ID')
        region = os.environ.get('AWS_REGION', 'us-east-1')
        stage = 'production'
        endpoint = f"https://{api_id}.execute-api.{region}.amazonaws.com/{stage}"
        
        apigw = boto3.client('apigatewaymanagementapi', endpoint_url=endpoint)
        
        sent_count = 0
        for conn in connections:
            try:
                apigw.post_to_connection(
                    ConnectionId=conn['connectionId'],
                    Data=json.dumps(message)
                )
                sent_count += 1
            except apigw.exceptions.GoneException:
                # Connexion morte, la supprimer
                delete_item(TABLE_CONNECTIONS, {'connectionId': conn['connectionId']})
                print(f"🗑️ Connexion morte supprimée: {conn['connectionId']}")
            except Exception as e:
                print(f"⚠️ Erreur envoi à {conn['connectionId']}: {e}")
        
        print(f"✅ Broadcast terminé: {sent_count}/{len(connections)} envoyés")
        
        return {
            'statusCode': 200,
            'body': json.dumps({'sent': sent_count})
        }
        
    except Exception as e:
        print(f"❌ Erreur broadcast: {e}")
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)})
        }
