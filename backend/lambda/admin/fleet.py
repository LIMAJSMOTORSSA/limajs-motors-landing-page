import json
import os
import sys
import uuid
from datetime import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
from shared.response import success, error, get_http_method, get_path_parameters, get_body
from shared.db import get_item, put_item, update_item, delete_item, scan_items

TABLE_BUSES = os.environ.get('TABLE_BUSES', 'limajs-buses')

def lambda_handler(event, context):
    """
    Handler for Admin Fleet (Bus) Management.
    Routes:
    - GET /admin/buses -> List all buses
    - POST /admin/buses -> Create new bus
    - PUT /admin/buses/{busId} -> Update bus
    - DELETE /admin/buses/{busId} -> Delete (or retire) bus
    """
    http_method = get_http_method(event)
    path_parameters = get_path_parameters(event)
    
    try:
        if http_method == 'GET':
            if path_parameters and 'busId' in path_parameters:
                 return get_bus(path_parameters['busId'])
            return list_buses(event)
        elif http_method == 'POST':
            return create_bus(event)
        elif http_method == 'PUT' and path_parameters and 'busId' in path_parameters:
            return update_bus(path_parameters['busId'], event)
        elif http_method == 'DELETE' and path_parameters and 'busId' in path_parameters:
            return delete_bus(path_parameters['busId'])
        else:
            return error(400, "Invalid request")
    except Exception as e:
        print(f"Error in fleet lambda: {e}")
        return error(500, str(e))

def list_buses(event):
    """List all buses with optional filtering."""
    query_params = event.get('queryStringParameters') or {}
    status_filter = query_params.get('status')
    
    filter_expr = {}
    if status_filter:
        filter_expr['status'] = status_filter
        
    buses = scan_items(TABLE_BUSES, filter_expr)
    return success({'data': buses, 'count': len(buses)})

def get_bus(bus_id):
    bus = get_item(TABLE_BUSES, {'busId': bus_id})
    if not bus:
        return error(404, "Bus not found")
    return success({'data': bus})

def create_bus(event):
    body = get_body(event)
    required = ['plate', 'model', 'capacity']
    if not all(k in body for k in required):
        return error(400, "Missing required fields")
    
    bus_id = str(uuid.uuid4())
    item = {
        'busId': bus_id,
        'plate': body['plate'],
        'model': body['model'],
        'capacity': int(body['capacity']),
        'status': body.get('status', 'ACTIVE'), # ACTIVE, MAINTENANCE, RETIRED
        'createdAt': datetime.utcnow().isoformat()
    }
    
    put_item(TABLE_BUSES, item)
    return success({'data': item}, "Bus created successfully")

def update_bus(bus_id, event):
    body = get_body(event)
    
    # Check existence
    existing = get_item(TABLE_BUSES, {'busId': bus_id})
    if not existing:
         return error(404, "Bus not found")

    update_data = {}
    allowed = ['plate', 'model', 'capacity', 'status']
    for k in allowed:
        if k in body:
            update_data[k] = body[k]
            
    if not update_data:
        return error(400, "No fields to update")
        
    update_data['updatedAt'] = datetime.utcnow().isoformat()
    
    # MongoDB update syntax passed to shared.db.update_item
    # update_item(table, key, update_expression/dict)
    # shared.db.update_item in MongoDB impl takes a dict of changes for $set usually
    result = update_item(TABLE_BUSES, {'busId': bus_id}, update_data)
    
    return success({'data': result}, "Bus updated successfully")

def delete_bus(bus_id):
    # Hard delete or Soft delete? Plan says "Retire" which is update status. 
    # But DELETE endpoint might be useful for cleanup.
    # Let's do hard delete for DELETE method, and use PUT for retire.
    
    delete_item(TABLE_BUSES, {'busId': bus_id})
    return success({'busId': bus_id}, "Bus deleted")
