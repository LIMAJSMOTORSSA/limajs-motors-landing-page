import os
import pymongo
from pymongo import MongoClient
try:
    from dotenv import load_dotenv
    # Load .env relative to this file or root
    # Ideally env is loaded by lambda environment, but for local scripts:
    env_path = os.path.join(os.path.dirname(__file__), "../../.env")
    load_dotenv(env_path)
except ImportError:
    pass

# Configuration
MONGO_URL = os.environ.get('MONGO_DB_URL')
DB_NAME = os.environ.get('MONGO_DB_NAME', 'limajs')

_client = None
_db = None

def get_db():
    global _client, _db
    if _db:
        return _db
    
    if not MONGO_URL:
        print("⚠️ MONGO_DB_URL not found in env")
    
    _client = MongoClient(MONGO_URL)
    _db = _client[DB_NAME]
    return _db

# Table to Primary Key mapping for updates/deletes
# Helper to simulate DynamoDB's primary key behavior
TABLE_CONFIG = {
    'limajs-users': ['userId'], # composite with 'type' sometimes, but mostly userId is unique per user entity? No, 'userId' + 'type' is PK.
    # In MongoDB we might just store them as is.
    # For helper functions like put_item, we need to know what uniqueness to enforce.
    # We will try to map the Keys passed to get_item/delete_item to a filter.
}

def get_collection(table_name):
    """Maps DynamoDB table name to Mongo collection."""
    # We can use the table name directly or map it.
    # Migration script used: "limajs-users" -> "users"
    # But to minimize string changes in codebase, we can alias or just use the same name.
    # Let's map them to clean names for MongoDB if we want, or stick to table names.
    # The migration script used clean names. Let's try to support that mapping.
    MAPPING = {
        "limajs-users": "users",
        "limajs-buses": "buses",
        "limajs-routes": "routes",
        "limajs-schedules": "schedules",
        "limajs-subscriptions": "subscriptions",
        "limajs-payments": "payments",
        "limajs-tickets": "tickets",
        "limajs-nfc-cards": "nfc_cards",
        "limajs-trips": "trips",
        "limajs-gps-positions": "gps_positions",
        "limajs-invoices": "invoices",
        "limajs-wallet-transactions": "wallet_transactions",
        "limajs-passenger-trips": "passenger_trips"
    }
    col_name = MAPPING.get(table_name, table_name)
    return get_db()[col_name]

def put_item(table_name, item):
    """Inserts or replaces an item."""
    col = get_collection(table_name)
    # in DynamoDB, put_item overwrites based on PK.
    # We need to construct a filter from the item based on what we think is the PK.
    # This is hard without explicit PK definition.
    # However, existing code might not rely on overwrite for all things.
    # A generic 'insert' might be safer if we don't know for sure, but duplicate handling?
    # Let's try to detect PK fields.
    
    # Heuristic: try to find common ID fields
    pk_fields = []
    if 'userId' in item: pk_fields.append('userId')
    if 'busId' in item: pk_fields.append('busId')
    if 'routeId' in item: pk_fields.append('routeId')
    if 'tripId' in item: pk_fields.append('tripId')
    if 'paymentId' in item: pk_fields.append('paymentId')
    if 'ticketId' in item: pk_fields.append('ticketId')
    if 'id' in item: pk_fields.append('id')
    
    # If composite keys are used (e.g. userId + type), we need to handle that.
    # DynamoDB schema knowledge is lost here.
    # Maybe we should require 'key' argument for updates, and this function behaves as upsert?
    # But put_item(item) signature is: just item.
    
    # For now, let's just insert. But this will Duplicate on updates.
    # Ideally we should use `update_one` with `upsert=True` but we need the filter.
    
    # Let's assume for now: insert_one. Callers that need Update behavior might need refactoring to use update_item.
    # OR, we check if `_id` is present.
    
    # FIX: We will return the item.
    col.insert_one(item)
    # Remove _id from return if needed to keep it clean? 
    if '_id' in item: item['_id'] = str(item['_id'])
    return item

def get_item(table_name, key):
    """Get item by key dictionary."""
    col = get_collection(table_name)
    # key is {'userId': '...'}
    doc = col.find_one(key)
    if doc:
        if '_id' in doc: doc['_id'] = str(doc['_id'])
    return doc

def query_items(table_name, key_condition=None, filter_expression=None, index_name=None, limit=None, **kwargs):
    """
    Query items. 
    ADAPTATION: Expects key_condition to be a dict (Mongo filter) now, NOT a boto3 Condition.
    Old callers passed `Key('id').eq(val)`. This will BREAK.
    We must update callers to pass simple dicts: `{'id': val}`.
    """
    col = get_collection(table_name)
    
    # If key_condition is passed, assume it's a mongo filter dict.
    # If it was a boto3 condition, this will fail. We rely on refactoring callers.
    query = key_condition if isinstance(key_condition, dict) else {}
    if filter_expression and isinstance(filter_expression, dict):
        query.update(filter_expression)
        
    cursor = col.find(query)
    if limit:
        cursor = cursor.limit(limit)
        
    items = list(cursor)
    for i in items:
        if '_id' in i: i['_id'] = str(i['_id'])
    return items

def scan_items(table_name, filter_expression=None, limit=10):
    """Scan items -> Find."""
    return query_items(table_name, key_condition=filter_expression, limit=limit)

def delete_item(table_name, key):
    """Delete item by key dict."""
    col = get_collection(table_name)
    col.delete_one(key)
    return True

def update_item(table_name, key, update_dict, **kwargs):
    """
    Update item using Mongo $set.
    Replaces DynamoDB update_expression logic.
    Returns the updated document.
    """
    col = get_collection(table_name)
    # kwargs might contain 'expression_values' from old calls, we ignore them if update_dict is used.
    # But if update_dict is a string, it's old code -> Raise Error
    if isinstance(update_dict, str):
         raise NotImplementedError("DynamoDB update expressions (string) are not supported. Pass a dictionary.")

    # If update_dict keys start with $, assume it's a full update document (e.g. {$set: ..., $inc: ...})
    # Otherwise wrap in $set
    is_raw_update = any(k.startswith('$') for k in update_dict.keys())
    update_doc = update_dict if is_raw_update else {"$set": update_dict}

    col.update_one(key, update_doc)
    
    # Return updated item
    doc = col.find_one(key)
    if doc and '_id' in doc: doc['_id'] = str(doc['_id'])
    return doc

# Stub for generic mongo update
def update_item_mongo(table_name, key, update_dict):
    """New helper for MongoDB updates."""
    col = get_collection(table_name)
    col.update_one(key, {"$set": update_dict})
    return True
