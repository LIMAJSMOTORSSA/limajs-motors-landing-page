import json
import os
import sys
import uuid
from datetime import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
from shared.response import success, error, get_http_method, get_path_parameters, get_body
from shared.db import get_item, put_item, update_item, delete_item, scan_items

TABLE_SCHEDULES = os.environ.get('TABLE_SCHEDULES', 'limajs-schedules')

def lambda_handler(event, context):
    """
    Handler for Admin Schedule Management.
    Routes:
    - GET /admin/schedules -> List all
    - POST /admin/schedules -> Create
    - PUT /admin/schedules/{scheduleId} -> Update
    - DELETE /admin/schedules/{scheduleId} -> Delete
    """
    http_method = get_http_method(event)
    path_parameters = get_path_parameters(event)
    
    try:
        if http_method == 'GET':
            return list_schedules(event)
        elif http_method == 'POST':
            return create_schedule(event)
        elif http_method == 'PUT' and path_parameters and 'scheduleId' in path_parameters:
            return update_schedule(path_parameters['scheduleId'], event)
        elif http_method == 'DELETE' and path_parameters and 'scheduleId' in path_parameters:
            return delete_schedule(path_parameters['scheduleId'])
        else:
            return error(400, "Invalid request")
    except Exception as e:
        print(f"Error in schedules lambda: {e}")
        return error(500, str(e))

def list_schedules(event):
    query_params = event.get('queryStringParameters') or {}
    route_filter = query_params.get('routeId')
    
    filter_expr = {}
    if route_filter:
        filter_expr['routeId'] = route_filter
        
    schedules = scan_items(TABLE_SCHEDULES, filter_expr)
    return success({'data': schedules, 'count': len(schedules)})

def create_schedule(event):
    body = get_body(event)
    required = ['routeId', 'departureTime', 'days'] # days: ['MON', 'TUE'...]
    if not all(k in body for k in required):
        return error(400, "Missing required fields")
    
    schedule_id = str(uuid.uuid4())
    item = {
        'scheduleId': schedule_id,
        'routeId': body['routeId'],
        'busId': body.get('busId'),
        'driverId': body.get('driverId'),
        'departureTime': body['departureTime'], # HH:MM
        'days': body['days'],
        'active': body.get('active', True),
        'createdAt': datetime.utcnow().isoformat()
    }
    
    put_item(TABLE_SCHEDULES, item)
    return success({'data': item}, "Schedule created successfully")

def update_schedule(schedule_id, event):
    body = get_body(event)
    
    existing = get_item(TABLE_SCHEDULES, {'scheduleId': schedule_id})
    if not existing:
         return error(404, "Schedule not found")
         
    update_data = {}
    allowed = ['routeId', 'busId', 'driverId', 'departureTime', 'days', 'active']
    for k in allowed:
        if k in body:
            update_data[k] = body[k]
            
    if not update_data:
        return error(400, "No fields to update")
        
    update_data['updatedAt'] = datetime.utcnow().isoformat()
    update_item(TABLE_SCHEDULES, {'scheduleId': schedule_id}, update_data)
    
    return success({'scheduleId': schedule_id}, "Schedule updated")

def delete_schedule(schedule_id):
    delete_item(TABLE_SCHEDULES, {'scheduleId': schedule_id})
    return success({'scheduleId': schedule_id}, "Schedule deleted")
