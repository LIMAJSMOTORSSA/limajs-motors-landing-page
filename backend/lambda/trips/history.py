"""
Historique des trajets pour les passagers
"""

import json
from datetime import datetime

import sys
sys.path.insert(0, '/var/task')
from shared.db import query_items, get_item
from shared.response import success, error, get_user_sub


def get_trip_history(event, context):
    """GET /trips/history - Historique des trajets du passager"""
    user_id = get_user_sub(event)
    
    if not user_id:
        return error(401, 'Unauthorized')
    
    params = event.get('queryStringParameters') or {}
    limit = int(params.get('limit', 20))
    start_date = params.get('startDate')
    end_date = params.get('endDate')
    
    # Query passenger trip records
    # Query passenger trip records (limajs-passenger-trips)
    filter_query = {'passengerId': user_id}
    
    # Add date filter if provided
    if start_date and end_date:
        filter_query['date'] = {'$gte': start_date, '$lte': end_date}
        
    response = query_items('limajs-passenger-trips', filter_query)
    
    # Sort in memory (most recent first) - equivalent to ScanIndexForward: False
    response.sort(key=lambda x: x.get('date', ''), reverse=True)
    
    # Apply limit
    response = response[:limit]
    
    # Get route names
    route_cache = {}
    

    
    trips = []
    for item in response:
        route_id = item.get('routeId')
        
        # Get route name (with caching)
        # Get route name (with caching)
        if route_id and route_id not in route_cache:
            # Query routes table
            route_resp = get_item('limajs-routes', {'routeId': route_id, 'type': 'INFO'})
            route_cache[route_id] = route_resp.get('name', 'Route inconnue') if route_resp else 'Route inconnue'
        
        trips.append({
            'tripId': item.get('tripId'),
            'date': item.get('date'),
            'routeId': route_id,
            'routeName': route_cache.get(route_id, 'Route inconnue'),
            'boardedAt': item.get('boardedAt'),
            'boardedStop': item.get('boardedStopName'),
            'alightedAt': item.get('alightedAt'),
            'alightedStop': item.get('alightedStopName'),
            'fare': float(item.get('fare', 0)),
            'paymentMethod': item.get('paymentMethod', 'subscription')
        })
    
    return success({
        'trips': trips,
        'count': len(trips)
    })


def handler(event, context):
    """Main handler"""
    return get_trip_history(event, context)
