import json
import os
import sys
import uuid
from datetime import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
from shared.response import success, error, get_http_method, get_path_parameters, get_body
from shared.db import get_item, put_item, update_item, delete_item, scan_items

TABLE_ROUTES = os.environ.get('TABLE_ROUTES', 'limajs-routes')

def lambda_handler(event, context):
    """
    Handler for Admin Route Management.
    Routes:
    - GET /admin/routes -> List all routes
    - POST /admin/routes -> Create new route
    - PUT /admin/routes/{routeId} -> Update route
    - DELETE /admin/routes/{routeId} -> Delete route
    """
    http_method = get_http_method(event)
    path_parameters = get_path_parameters(event)
    
    try:
        if http_method == 'GET':
            if path_parameters and 'routeId' in path_parameters:
                 return get_route(path_parameters['routeId'])
            return list_routes(event)
        elif http_method == 'POST':
            return create_route(event)
        elif http_method == 'PUT' and path_parameters and 'routeId' in path_parameters:
            return update_route(path_parameters['routeId'], event)
        elif http_method == 'DELETE' and path_parameters and 'routeId' in path_parameters:
            return delete_route(path_parameters['routeId'])
        else:
            return error(400, "Invalid request")
    except Exception as e:
        print(f"Error in routes lambda: {e}")
        return error(500, str(e))

def list_routes(event):
    routes = scan_items(TABLE_ROUTES, {})
    return success({'data': routes, 'count': len(routes)})

def get_route(route_id):
    route = get_item(TABLE_ROUTES, {'routeId': route_id})
    if not route:
        return error(404, "Route not found")
    return success({'data': route})

def create_route(event):
    body = get_body(event)
    required = ['name', 'code', 'price']
    if not all(k in body for k in required):
        return error(400, "Missing required fields")
    
    route_id = str(uuid.uuid4())
    item = {
        'routeId': route_id,
        'name': body['name'],
        'code': body['code'],
        'price': float(body['price']),
        'stops': body.get('stops', []), # List of dicts {name, lat, lon}
        'status': body.get('status', 'ACTIVE'),
        'createdAt': datetime.utcnow().isoformat()
    }
    
    put_item(TABLE_ROUTES, item)
    return success({'data': item}, "Route created successfully")

def update_route(route_id, event):
    body = get_body(event)
    
    existing = get_item(TABLE_ROUTES, {'routeId': route_id})
    if not existing:
         return error(404, "Route not found")
         
    update_data = {}
    allowed = ['name', 'code', 'price', 'stops', 'status']
    for k in allowed:
        if k in body:
            update_data[k] = body[k]
            if k == 'price':
                update_data[k] = float(body[k])
            
    if not update_data:
        return error(400, "No fields to update")
        
    update_data['updatedAt'] = datetime.utcnow().isoformat()
    
    update_item(TABLE_ROUTES, {'routeId': route_id}, update_data)
    
    return success({'routeId': route_id}, "Route updated successfully")

def delete_route(route_id):
    delete_item(TABLE_ROUTES, {'routeId': route_id})
    return success({'routeId': route_id}, "Route deleted")
