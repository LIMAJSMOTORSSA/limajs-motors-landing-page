import json
import os
import sys
import uuid
import boto3
from datetime import datetime

sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
from shared.response import success, error

# Removing boto3 condition imports
# from boto3.dynamodb.conditions import Key, Attr

TABLE_PAYMENTS = os.environ.get('TABLE_PAYMENTS', 'limajs-payments')
S3_BUCKET = os.environ.get('AWS_S3_BUCKET_NAME')

s3 = boto3.client('s3')

def lambda_handler(event, context):
    """
    Handler pour Payments.
    Routes:
    - POST /payments/upload -> Upload preuve de paiement
    - POST /payments/presigned-url -> Générer URL pré-signée pour upload S3
    - GET /payments/pending -> Liste paiements en attente (admin)
    - POST /payments/{paymentId}/approve -> Approuver paiement (admin)
    - POST /payments/{paymentId}/reject -> Rejeter paiement (admin)
    """
    http_method = event.get('httpMethod')
    path = event.get('path', '')
    path_parameters = event.get('pathParameters') or {}
    
    try:
        if '/presigned-url' in path and http_method == 'POST':
            return generate_presigned_url(event)
        elif '/upload' in path and http_method == 'POST':
            return create_payment(event)
        elif '/pending' in path and http_method == 'GET':
            return list_pending_payments()
        elif '/approve' in path and http_method == 'POST':
            return approve_payment(path_parameters['paymentId'], event)
        elif '/reject' in path and http_method == 'POST':
            return reject_payment(path_parameters['paymentId'], event)
        else:
            return error(400, "Invalid request")
    except Exception as e:
        print(f"Error: {e}")
        return error(500, str(e))

def generate_presigned_url(event):
    """Générer une URL pré-signée pour upload direct S3 depuis le frontend."""
    body = json.loads(event.get('body', '{}'))
    
    file_name = body.get('fileName')
    file_type = body.get('fileType', 'image/jpeg')
    
    if not file_name:
        return error(400, "fileName is required")
    
    # Récupérer userId
    claims = event.get('requestContext', {}).get('authorizer', {}).get('claims', {})
    user_sub = claims.get('sub')
    
    if not user_sub:
        return error(401, "Unauthorized")
    
    # Générer clé S3 unique
    s3_key = f"payments/{user_sub}/{uuid.uuid4()}-{file_name}"
    
    try:
        # Générer URL pré-signée (valide 15 minutes)
        presigned_url = s3.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': S3_BUCKET,
                'Key': s3_key,
                'ContentType': file_type
            },
            ExpiresIn=900  # 15 minutes
        )
        
        return success({
            'uploadUrl': presigned_url,
            's3Key': s3_key
        }, "Presigned URL generated")
        
    except Exception as e:
        print(f"Error generating presigned URL: {e}")
        return error(500, str(e))

def create_payment(event):
    """Enregistrer un paiement après upload S3."""
    body = json.loads(event.get('body', '{}'))
    
    claims = event.get('requestContext', {}).get('authorizer', {}).get('claims', {})
    user_sub = claims.get('sub')
    
    if not user_sub:
        return error(401, "Unauthorized")
    
    user_id = f"USER#{user_sub}"
    
    required = ['amount', 'subscriptionType', 'proofS3Key']
    for field in required:
        if field not in body:
            return error(400, f"Missing required field: {field}")
    
    payment_id = f"PAYMENT#{str(uuid.uuid4())}"
    
    payment_item = {
        'paymentId': payment_id,
        'timestamp': datetime.utcnow().isoformat(),
        'userId': user_id,
        'amount': body['amount'],
        'currency': body.get('currency', 'HTG'),
        'method': body.get('method', 'BANK_TRANSFER'),
        'subscriptionType': body['subscriptionType'],
        'status': 'PENDING',  # PENDING, APPROVED, REJECTED
        'proofS3Key': body['proofS3Key'],
        'notes': body.get('notes', ''),
        'createdAt': datetime.utcnow().isoformat()
    }
    
    put_item(TABLE_PAYMENTS, payment_item)
    
    return success({
        'payment': payment_item
    }, "Payment proof uploaded successfully. Awaiting admin approval.")

def list_pending_payments():
    """Lister tous les paiements en attente (Admin)."""
    # Key('status').eq('PENDING') -> {'status': 'PENDING'}
    payments = query_items(
        TABLE_PAYMENTS,
        {'status': 'PENDING'}
    )
    
    return success({'payments': payments, 'count': len(payments)})

def approve_payment(payment_id, event):
    """Approuver un paiement (Admin)."""
    # DynamoDB expects Key={'paymentId': ...} if it's primary key
    # In legacy code: get_item(..., {'paymentId': ..., 'timestamp': ...}) 
    # This implies composite key. BUT we don't know timestamp here unless transmitted? 
    # Legacy code tried to get timestamp from body.
    # We can just query by paymentId if we assume uniqueness or use scan/find fallback.
    # Mongo find_one by paymentId is simple.
    
    # We try get_item first with paymentId (if we treat it as simple query). 
    # get_item in db.py findsOne using the dict as filter. So {'paymentId': pid} is enough if unique.
    
    payment = get_item(TABLE_PAYMENTS, {'paymentId': payment_id})
        
    if not payment:
        return error(404, "Payment not found")
    
    # Mettre à jour le statut
    updated = update_item(
        TABLE_PAYMENTS,
        {'paymentId': payment_id}, # using simple filter
        {'status': 'APPROVED', 'approvedAt': datetime.utcnow().isoformat()}
    )
    
    # Activer l'abonnement correspondant
    TABLE_SUBSCRIPTIONS = os.environ.get('TABLE_SUBSCRIPTIONS', 'limajs-subscriptions')
    
    # Trouver l'abonnement PENDING lié à ce paiement
    # scan_items(..., Attr('paymentId').eq(payment_id))
    subs = scan_items(TABLE_SUBSCRIPTIONS, {'paymentId': payment_id})
    
    if subs:
        sub = subs[0]
        # In current DynamoDB table, subscription Key is implicit/complex?
        # In migration we copied it. We need to identify it.
        # Assuming we can update by internal _id or some unique field.
        # But db.py update_item expects a filter.
        # We can use {'paymentId': payment_id} again if 1:1, or use sub's fields.
        # Let's use whatever we have to uniquely identify.
        # Legacy code used: {'userId': sub['userId'], 'subscriptionId': sub['subscriptionId']}
        # So we use that filter.
        
        update_item(
            TABLE_SUBSCRIPTIONS,
            {'userId': sub['userId'], 'subscriptionId': sub['subscriptionId']},
            {'status': 'ACTIVE', 'activatedAt': datetime.utcnow().isoformat()}
        )
        print(f"✅ Abonnement {sub.get('subscriptionId')} activé")
    
    return success({'payment': updated}, "Payment approved and subscription activated")

def reject_payment(payment_id, event):
    """Rejeter un paiement (Admin)."""
    body = json.loads(event.get('body', '{}'))
    
    # scan/find payment
    all_payments = scan_items(TABLE_PAYMENTS, {'paymentId': payment_id})
    if not all_payments:
        return error(404, "Payment not found")
    
    payment = all_payments[0]
    
    updated = update_item(
        TABLE_PAYMENTS,
        {'paymentId': payment_id},
        {
            'status': 'REJECTED',
            'rejectedAt': datetime.utcnow().isoformat(),
            'rejectionReason': body.get('reason', 'No reason provided')
        }
    )
    
    return success({'payment': updated}, "Payment rejected")
