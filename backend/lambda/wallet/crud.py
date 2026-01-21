"""
Système Wallet - Gestion du solde et des transactions
"""

import json
import os
from datetime import datetime
from decimal import Decimal
import uuid

import boto3

# Imports locaux
import sys
sys.path.append(os.path.join(os.path.dirname(__file__), '../../'))
from shared.db import get_item, put_item, query_items, get_collection
from shared.response import success, error, get_user_sub

TABLE_USERS = os.environ.get('TABLE_USERS', 'limajs-users')
TABLE_TRANSACTIONS = os.environ.get('TABLE_TRANSACTIONS', 'limajs-wallet-transactions')
TABLE_PAYMENTS = os.environ.get('TABLE_PAYMENTS', 'limajs-payments')

def lambda_handler(event, context):
    """Main handler routing to appropriate function"""
    # Mapping for different entry points (REST vs HTTP API vs direct invoke)
    # The original handler seemed to map based on path ending
    method = event.get('httpMethod', event.get('requestContext', {}).get('http', {}).get('method'))
    path = event.get('path', event.get('rawPath', ''))
    
    if path.endswith('/balance') and method == 'GET':
        return get_balance(event, context)
    elif path.endswith('/transactions') and method == 'GET':
        return get_transactions(event, context)
    elif path.endswith('/recharge') and method == 'POST':
        return request_recharge(event, context)
    elif path.endswith('/pay') and method == 'POST':
        return pay_with_wallet(event, context)
    
    # Fallback/Direct calls
    if event.get('action') == 'credit_wallet':
        # Internal call
        return credit_wallet(
            event.get('userId'),
            Decimal(str(event.get('amount'))),
            event.get('description'),
            event.get('relatedId')
        )
    
    return error(404, 'Not found')


def get_balance(event, context):
    """GET /wallet/balance - Retourne le solde du wallet"""
    user_id = get_user_sub(event)
    
    if not user_id:
        return error(401, 'Unauthorized')
    
    # Mongo: get_item
    user = get_item(TABLE_USERS, {'userId': f"USER#{user_id}", 'type': 'PROFILE'})
    
    if not user:
        return error(404, "User not found")
    
    return success({
        'balance': float(user.get('walletBalance', 0)),
        'currency': user.get('walletCurrency', 'HTG'),
        'lastUpdate': user.get('lastWalletUpdate')
    })


def get_transactions(event, context):
    """GET /wallet/transactions - Historique des transactions"""
    user_id = get_user_sub(event)
    
    if not user_id:
        return error(401, 'Unauthorized')
    
    params = event.get('queryStringParameters') or {}
    limit = int(params.get('limit', 20))
    
    col = get_collection(TABLE_TRANSACTIONS)
    
    # Mongo Find + Sort
    cursor = col.find({'userId': f"USER#{user_id}"}).sort('createdAt', -1).limit(limit)
    items = list(cursor)
    
    transactions = []
    for item in items:
        transactions.append({
            'transactionId': item.get('transactionId'),
            'type': item.get('type'),  # credit or debit
            'amount': float(item.get('amount', 0)),
            'description': item.get('description'),
            'date': item.get('createdAt'),
            'relatedId': item.get('relatedId')
        })
    
    return success({'transactions': transactions})


def request_recharge(event, context):
    """POST /wallet/recharge - Demande de recharge (avec preuve de paiement)"""
    user_id = get_user_sub(event)
    
    if not user_id:
        return error(401, 'Unauthorized')
    
    try:
        body = json.loads(event.get('body', '{}'))
    except:
        return error(400, 'Invalid JSON body')
    
    amount = body.get('amount')
    if not amount or float(amount) <= 0:
        return error(400, 'Invalid amount')
    
    # Create a pending recharge request in PAYMENTS table
    payment_id = f"recharge-{uuid.uuid4().hex[:8]}"
    
    item = {
        'userId': f"USER#{user_id}",
        'paymentId': payment_id,
        'type': 'wallet_recharge',
        'amount': float(amount), # Mongo uses native types
        'currency': 'HTG',
        'status': 'pending',
        'submittedAt': datetime.now().isoformat(),
        # 'GSI1PK': ... (Removed DynamoDB Index Fields)
    }
    
    put_item(TABLE_PAYMENTS, item)
    
    # Generate presigned URL for proof upload
    s3 = boto3.client('s3')
    bucket = os.environ.get('AWS_S3_BUCKET_NAME') # Fixed env var name to match updated config
    key = f"recharge-proofs/{user_id}/{payment_id}.jpg"
    
    try:
        upload_url = s3.generate_presigned_url(
            'put_object',
            Params={
                'Bucket': bucket,
                'Key': key,
                'ContentType': 'image/jpeg'
            },
            ExpiresIn=3600
        )
    except Exception as e:
        print(f"S3 Error: {e}")
        # Return success but without URL if S3 fails (or handle error)
        # For now, let's assume it works or fail.
        return error(500, "Failed to generate upload URL")
    
    return success({
        'paymentId': payment_id,
        'uploadUrl': upload_url,
        'message': 'Veuillez uploader votre preuve de paiement'
    }, 201)


def pay_with_wallet(event, context):
    """POST /wallet/pay - Payer avec le solde du wallet"""
    user_id = get_user_sub(event)
    
    if not user_id:
        return error(401, 'Unauthorized')
    
    try:
        body = json.loads(event.get('body', '{}'))
    except:
        return error(400, 'Invalid JSON body')
    
    amount = body.get('amount')
    description = body.get('description', 'Paiement')
    related_id = body.get('relatedId')  # subscriptionId or tripId
    
    if not amount or float(amount) <= 0:
        return error(400, 'Invalid amount')
    
    amount_f = float(amount)
    
    # Atomic deduction using Mongo
    col_users = get_collection(TABLE_USERS)
    
    # Condition: walletBalance >= amount
    result = col_users.update_one(
        {
            'userId': f"USER#{user_id}", 
            'type': 'PROFILE',
            'walletBalance': {'$gte': amount_f}
        },
        {
            '$inc': {'walletBalance': -amount_f},
            '$set': {'lastWalletUpdate': datetime.now().isoformat()}
        }
    )
    
    if result.matched_count == 0:
        # Either user not found or insufficient balance.
        # Check if user exists
        user = get_item(TABLE_USERS, {'userId': f"USER#{user_id}", 'type': 'PROFILE'})
        if not user:
            return error(404, "User not found")
        
        current_balance = float(user.get('walletBalance', 0))
        return error(400, 'Solde insuffisant', {
            'currentBalance': current_balance,
            'required': amount_f
        })
    
    # Retrieve new balance
    user = get_item(TABLE_USERS, {'userId': f"USER#{user_id}", 'type': 'PROFILE'})
    new_balance = float(user.get('walletBalance', 0))
    
    # Record transaction
    transaction_id = f"tx-{uuid.uuid4().hex[:12]}"
    
    tx_item = {
        'transactionId': transaction_id,
        'userId': f"USER#{user_id}",
        'type': 'debit',
        'amount': amount_f,
        'description': description,
        'relatedId': related_id,
        'balanceAfter': new_balance,
        'createdAt': datetime.now().isoformat()
    }
    
    put_item(TABLE_TRANSACTIONS, tx_item)
    
    return success({
        'transactionId': transaction_id,
        'amount': amount_f,
        'newBalance': new_balance,
        'message': 'Paiement effectué avec succès'
    })


def credit_wallet(user_id_full, amount, description, related_id=None):
    """Fonction utilitaire pour créditer un wallet (appelée après approbation d'une recharge)"""
    # user_id_full expects "USER#..." format as used internally
    
    amount_f = float(amount)
    col_users = get_collection(TABLE_USERS)
    
    col_users.update_one(
        {'userId': user_id_full, 'type': 'PROFILE'},
        {
            '$inc': {'walletBalance': amount_f},
            '$set': {
                'walletCurrency': 'HTG',
                'lastWalletUpdate': datetime.now().isoformat()
            }
        },
        upsert=False # Do not create user if not exists
    )
    
    # Get new balance for record
    user = get_item(TABLE_USERS, {'userId': user_id_full, 'type': 'PROFILE'})
    new_balance = float(user.get('walletBalance', 0)) if user else amount_f
    
    # Record transaction
    transaction_id = f"tx-{uuid.uuid4().hex[:12]}"
    
    tx_item = {
        'transactionId': transaction_id,
        'userId': user_id_full,
        'type': 'credit',
        'amount': amount_f,
        'description': description,
        'relatedId': related_id,
        'balanceAfter': new_balance,
        'createdAt': datetime.now().isoformat()
    }
    
    put_item(TABLE_TRANSACTIONS, tx_item)
    
    return {
        'transactionId': transaction_id,
        'newBalance': new_balance
    }

# Alias for lambda_handler for compatibility if needed
handler = lambda_handler
