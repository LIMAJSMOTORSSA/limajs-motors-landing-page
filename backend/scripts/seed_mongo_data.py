#!/usr/bin/env python3
"""
MongoDB Seed Script for LimaJS Motors Admin Dashboard
Uses shared.db adapter to insert data into MongoDB.
"""

import os
import sys
from datetime import datetime, timedelta
from decimal import Decimal
import random

# Add parent directory to path for imports
sys.path.insert(0, os.path.join(os.path.dirname(__file__), '..'))

from shared.db import put_item, get_db

# =============================================================================
# SEED DATA
# =============================================================================

def get_users():
    """Generate user data."""
    return [
        {
            'userId': 'USER#admin-001',
            'type': 'PROFILE',
            'email': 'admin@limajs.com',
            'firstName': 'Jean',
            'lastName': 'Directeur',
            'phone': '+509 3456 7890',
            'role': 'admin',
            'status': 'ACTIVE',
            'createdAt': (datetime.now() - timedelta(days=180)).isoformat()
        },
        {
            'userId': 'USER#driver-001',
            'type': 'PROFILE',
            'email': 'pierre.chauffeur@limajs.com',
            'firstName': 'Pierre',
            'lastName': 'Jean-Baptiste',
            'phone': '+509 3111 2222',
            'role': 'driver',
            'status': 'ACTIVE',
            'licenseNumber': 'DL-2024-001',
            'assignedBusId': 'BUS#bus-001',
            'createdAt': (datetime.now() - timedelta(days=120)).isoformat()
        },
        {
            'userId': 'USER#driver-002',
            'type': 'PROFILE',
            'email': 'marie.chauffeur@limajs.com',
            'firstName': 'Marie',
            'lastName': 'Desrosiers',
            'phone': '+509 3222 3333',
            'role': 'driver',
            'status': 'ACTIVE',
            'licenseNumber': 'DL-2024-002',
            'assignedBusId': 'BUS#bus-002',
            'createdAt': (datetime.now() - timedelta(days=90)).isoformat()
        },
        {
            'userId': 'USER#passenger-001',
            'type': 'PROFILE',
            'email': 'client1@gmail.com',
            'firstName': 'Jacques',
            'lastName': 'Bonhomme',
            'phone': '+509 4111 1111',
            'role': 'passenger',
            'status': 'ACTIVE',
            'createdAt': (datetime.now() - timedelta(days=60)).isoformat()
        },
        {
            'userId': 'USER#passenger-002',
            'type': 'PROFILE',
            'email': 'client2@gmail.com',
            'firstName': 'Sophie',
            'lastName': 'Laurent',
            'phone': '+509 4222 2222',
            'role': 'passenger',
            'status': 'ACTIVE',
            'createdAt': (datetime.now() - timedelta(days=45)).isoformat()
        },
        {
            'userId': 'USER#passenger-003',
            'type': 'PROFILE',
            'email': 'client3@gmail.com',
            'firstName': 'Marc',
            'lastName': 'Antoine',
            'phone': '+509 4333 3333',
            'role': 'passenger',
            'status': 'ACTIVE',
            'createdAt': (datetime.now() - timedelta(days=30)).isoformat()
        },
    ]

def get_buses():
    """Generate bus data."""
    return [
        {
            'busId': 'BUS#bus-001',
            'type': 'INFO',
            'plateNumber': 'AA-1234',
            'model': 'Mercedes Sprinter 519',
            'manufacturer': 'Mercedes-Benz',
            'capacity': 22,
            'status': 'ACTIVE',
            'fuelType': 'DIESEL',
            'year': 2022,
            'currentMileage': 45000,
            'currentDriverId': 'USER#driver-001',
            'latitude': 18.5429,
            'longitude': -72.3388,
            'lastHeartbeat': datetime.now().isoformat(),
            'createdAt': (datetime.now() - timedelta(days=365)).isoformat()
        },
        {
            'busId': 'BUS#bus-002',
            'type': 'INFO',
            'plateNumber': 'BB-5678',
            'model': 'Toyota Coaster',
            'manufacturer': 'Toyota',
            'capacity': 30,
            'status': 'ACTIVE',
            'fuelType': 'DIESEL',
            'year': 2023,
            'currentMileage': 22000,
            'currentDriverId': 'USER#driver-002',
            'latitude': 18.5450,
            'longitude': -72.3400,
            'lastHeartbeat': datetime.now().isoformat(),
            'createdAt': (datetime.now() - timedelta(days=200)).isoformat()
        },
        {
            'busId': 'BUS#bus-003',
            'type': 'INFO',
            'plateNumber': 'CC-9012',
            'model': 'Hyundai County',
            'manufacturer': 'Hyundai',
            'capacity': 25,
            'status': 'MAINTENANCE',
            'fuelType': 'DIESEL',
            'year': 2021,
            'currentMileage': 68000,
            'createdAt': (datetime.now() - timedelta(days=400)).isoformat()
        },
    ]

def get_routes():
    """Generate route data."""
    return [
        {
            'routeId': 'ROUTE#route-001',
            'type': 'INFO',
            'shortCode': 'A',
            'name': 'Ligne A - Centre-Ville Express',
            'description': 'Liaison rapide centre-ville',
            'color': '#2563EB',
            'status': 'ACTIVE',
            'stops': [
                {'stopId': 'stop-a1', 'name': 'Gare Centrale', 'lat': 18.5429, 'lng': -72.3388, 'order': 1},
                {'stopId': 'stop-a2', 'name': 'Place du Marché', 'lat': 18.5450, 'lng': -72.3400, 'order': 2},
                {'stopId': 'stop-a3', 'name': 'Centre Commercial', 'lat': 18.5480, 'lng': -72.3420, 'order': 3},
                {'stopId': 'stop-a4', 'name': 'Terminal Nord', 'lat': 18.5560, 'lng': -72.3480, 'order': 4},
            ],
            'estimatedDuration': 35,
            'distance': 8.5,
            'createdAt': (datetime.now() - timedelta(days=180)).isoformat()
        },
        {
            'routeId': 'ROUTE#route-002',
            'type': 'INFO',
            'shortCode': 'B',
            'name': 'Ligne B - Aéroport Shuttle',
            'description': 'Navette aéroport',
            'color': '#DC2626',
            'status': 'ACTIVE',
            'stops': [
                {'stopId': 'stop-b1', 'name': 'Gare Centrale', 'lat': 18.5429, 'lng': -72.3388, 'order': 1},
                {'stopId': 'stop-b2', 'name': 'Aéroport', 'lat': 18.5800, 'lng': -72.2900, 'order': 2},
            ],
            'estimatedDuration': 45,
            'distance': 15.2,
            'createdAt': (datetime.now() - timedelta(days=150)).isoformat()
        },
    ]

def get_schedules():
    """Generate schedule data."""
    schedules = []
    times = ['06:00', '08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00']
    routes = ['ROUTE#route-001', 'ROUTE#route-002']
    buses = ['BUS#bus-001', 'BUS#bus-002', 'BUS#bus-003']
    drivers = ['USER#driver-001', 'USER#driver-002']
    
    for route in routes:
        for i, time in enumerate(times):
            schedules.append({
                'scheduleId': f"SCHED#{route.split('#')[1][-3:]}-{i+1:02d}",
                'routeId': route,
                'departureTime': time,
                'days': ['MON', 'TUE', 'WED', 'THU', 'FRI'],
                'busId': buses[i % len(buses)],
                'driverId': drivers[i % len(drivers)],
                'active': True,
                'createdAt': datetime.now().isoformat()
            })
    return schedules

def get_payments():
    """Generate payment data."""
    payments = []
    users = ['USER#passenger-001', 'USER#passenger-002', 'USER#passenger-003']
    
    for i in range(15):
        days_ago = random.randint(1, 30)
        amount = random.choice([150, 750, 2500])
        status = random.choice(['APPROVED', 'APPROVED', 'APPROVED', 'PENDING'])
        
        payment = {
            'paymentId': f'PAY#{i+1:04d}',
            'userId': random.choice(users),
            'amount': amount,
            'currency': 'HTG',
            'status': status,
            'subscriptionType': 'MONTHLY' if amount == 2500 else ('WEEKLY' if amount == 750 else 'DAILY'),
            'paymentMethod': random.choice(['MONCASH', 'NATCASH', 'CARD']),
            'createdAt': (datetime.now() - timedelta(days=days_ago)).isoformat(),
        }
        if status == 'APPROVED':
            payment['approvedAt'] = (datetime.now() - timedelta(days=days_ago-1)).isoformat()
        payments.append(payment)
    return payments

def get_subscriptions():
    """Generate subscription data."""
    return [
        {
            'subscriptionId': 'SUB#001',
            'userId': 'USER#passenger-001',
            'type': 'MONTHLY',
            'status': 'ACTIVE',
            'startDate': (datetime.now() - timedelta(days=10)).isoformat(),
            'endDate': (datetime.now() + timedelta(days=20)).isoformat(),
            'createdAt': (datetime.now() - timedelta(days=10)).isoformat()
        },
        {
            'subscriptionId': 'SUB#002',
            'userId': 'USER#passenger-002',
            'type': 'WEEKLY',
            'status': 'ACTIVE',
            'startDate': (datetime.now() - timedelta(days=3)).isoformat(),
            'endDate': (datetime.now() + timedelta(days=4)).isoformat(),
            'createdAt': (datetime.now() - timedelta(days=3)).isoformat()
        },
        {
            'subscriptionId': 'SUB#003',
            'userId': 'USER#passenger-003',
            'type': 'DAILY',
            'status': 'EXPIRED',
            'startDate': (datetime.now() - timedelta(days=5)).isoformat(),
            'endDate': (datetime.now() - timedelta(days=4)).isoformat(),
            'createdAt': (datetime.now() - timedelta(days=5)).isoformat()
        },
    ]

def get_trips():
    """Generate trip data."""
    trips = []
    routes = ['ROUTE#route-001', 'ROUTE#route-002']
    buses = ['BUS#bus-001', 'BUS#bus-002']
    drivers = ['USER#driver-001', 'USER#driver-002']
    
    for i in range(10):
        hours_ago = random.randint(1, 48)
        trips.append({
            'tripId': f'TRIP#{i+1:04d}',
            'routeId': random.choice(routes),
            'busId': random.choice(buses),
            'driverId': random.choice(drivers),
            'status': 'COMPLETED',
            'startTime': (datetime.now() - timedelta(hours=hours_ago)).isoformat(),
            'endTime': (datetime.now() - timedelta(hours=hours_ago-1)).isoformat(),
            'passengerCount': random.randint(5, 25),
            'timestamp': (datetime.now() - timedelta(hours=hours_ago)).isoformat(),
            'createdAt': (datetime.now() - timedelta(hours=hours_ago)).isoformat()
        })
    return trips

# =============================================================================
# SEEDING FUNCTIONS
# =============================================================================

def seed_collection(table_name, items):
    """Insert items into a collection."""
    print(f"  📥 Seeding {table_name} ({len(items)} items)...")
    count = 0
    for item in items:
        try:
            put_item(table_name, item)
            count += 1
        except Exception as e:
            print(f"     ⚠️ Error inserting item: {e}")
    print(f"     ✅ Inserted {count} items")
    return count

def main():
    print("🌱 LimaJS Motors - MongoDB Seeding")
    print("=" * 50)
    
    # Test DB connection
    try:
        db = get_db()
        print(f"✅ Connected to MongoDB: {db.name}")
    except Exception as e:
        print(f"❌ Failed to connect to MongoDB: {e}")
        print("   Make sure MONGO_DB_URL is set in .env")
        return
    
    total = 0
    total += seed_collection('limajs-users', get_users())
    total += seed_collection('limajs-buses', get_buses())
    total += seed_collection('limajs-routes', get_routes())
    total += seed_collection('limajs-schedules', get_schedules())
    total += seed_collection('limajs-payments', get_payments())
    total += seed_collection('limajs-subscriptions', get_subscriptions())
    total += seed_collection('limajs-trips', get_trips())
    
    print("=" * 50)
    print(f"🎉 Seeding complete! {total} total items inserted.")

if __name__ == "__main__":
    main()
