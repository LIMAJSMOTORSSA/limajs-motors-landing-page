import json
import os
import sys
from datetime import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
from shared.response import success, error, get_http_method, get_path_parameters, get_body
from shared.db import get_item, put_item, update_item, scan_items

TABLE_PAYMENTS = os.environ.get('TABLE_PAYMENTS', 'limajs-payments')
TABLE_SUBSCRIPTIONS = os.environ.get('TABLE_SUBSCRIPTIONS', 'limajs-subscriptions')

def lambda_handler(event, context):
    """
    Handler for Admin Payment Management.
    Routes:
    - GET /admin/payments?status=... -> List payments
    - POST /admin/payments/{paymentId}/approve -> Approve payment
    - POST /admin/payments/{paymentId}/reject -> Reject payment
    """
    http_method = get_http_method(event)
    path_parameters = get_path_parameters(event)
    path = event.get('rawPath') or event.get('path', '')
    
    try:
        if http_method == 'GET':
            return list_payments(event)
        elif http_method == 'POST' and path_parameters and 'paymentId' in path_parameters:
            if '/approve' in path:
                return approve_payment(path_parameters['paymentId'])
            elif '/reject' in path:
                return reject_payment(path_parameters['paymentId'], event)
            else:
                 return error(400, "Invalid action")
        else:
            return error(400, "Invalid request")
    except Exception as e:
        print(f"Error in payments lambda: {e}")
        return error(500, str(e))

def list_payments(event):
    query_params = event.get('queryStringParameters') or {}
    status_filter = query_params.get('status')
    
    filter_expr = {}
    if status_filter:
        filter_expr['status'] = status_filter
        
    payments = scan_items(TABLE_PAYMENTS, filter_expr)
    return success({'data': payments, 'count': len(payments)})

def approve_payment(payment_id):
    # 1. Update Payment Status
    payment = get_item(TABLE_PAYMENTS, {'paymentId': payment_id})
    if not payment:
        return error(404, "Payment not found")
        
    if payment['status'] != 'PENDING':
        return error(400, "Payment is not pending")
        
    now = datetime.utcnow().isoformat()
    update_item(
        TABLE_PAYMENTS,
        {'paymentId': payment_id},
        {'status': 'APPROVED', 'approvedAt': now}
    )
    
    # 2. Activate Subscription if applicable
    # Assuming the payment object has a usage/reference to a subscription
    metadata = payment.get('metadata', {})
    if metadata.get('type') == 'SUBSCRIPTION' and metadata.get('subscriptionId'):
        sub_id = metadata['subscriptionId']
        update_item(
            TABLE_SUBSCRIPTIONS,
            {'subscriptionId': sub_id},
            {'status': 'ACTIVE', 'activatedAt': now}
        )
        
    return success({'paymentId': payment_id}, "Payment approved")

def reject_payment(payment_id, event):
    body = get_body(event) or {}
    reason = body.get('reason', 'Rejected by admin')
    
    payment = get_item(TABLE_PAYMENTS, {'paymentId': payment_id})
    if not payment:
         return error(404, "Payment not found")
         
    if payment['status'] != 'PENDING':
        return error(400, "Payment is not pending")
        
    now = datetime.utcnow().isoformat()
    update_item(
        TABLE_PAYMENTS,
        {'paymentId': payment_id},
        {'status': 'REJECTED', 'rejectedAt': now, 'rejectionReason': reason}
    )
    
    return success({'paymentId': payment_id}, "Payment rejected")
