import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from pymongo import MongoClient
from datetime import datetime

app = Flask(__name__)
CORS(app)  # Allow cross-origin requests (necessary for Cordova apps)

# MongoDB connection using environment variable for URI
app.config["MONGO_URI"] = os.getenv("MONGO_URI")
client = MongoClient(app.config["MONGO_URI"])
db = client['judicabs_db']
bookings_collection = db['bookings']
bills_collection = db['bills']


@app.route('/bookings', methods=['GET'])
def get_bookings():
    # Get date filter from query parameters
    date_filter = request.args.get('date')  # format: YYYY-MM-DD
    
    query = {}

    if date_filter:
        try:
            # Convert string to datetime object
            selected_date = datetime.strptime(date_filter, '%Y-%m-%d')
            start_of_day = selected_date.replace(hour=0, minute=0, second=0, microsecond=0)
            end_of_day = selected_date.replace(hour=23, minute=59, second=59, microsecond=999999)
            
            # Apply date filter
            query['created_at'] = {'$gte': start_of_day, '$lte': end_of_day}
        except ValueError:
            return jsonify({"error": "Invalid date format. Use YYYY-MM-DD."}), 400

    # Fetch bookings based on the query
    bookings = list(bookings_collection.find(query, {'_id': 0}))  # Exclude MongoDB ObjectId
    
    return jsonify(bookings)


@app.route('/create_bill', methods=['POST'])
def create_bill():
    try:
        # Retrieve JSON data from the request body
        bill_data = request.get_json()

        # Ensure necessary data is provided
        required_fields = ["bill_no", "date", "customer_name", "customer_phone", "driver_name", "driver_bata", "car_type", "car_number", 
                           "pls_visit", "start_time", "close_time", "start_kms", "close_kms", "total_kms", "rent", "diesel_amount", "profit_amount"]
        for field in required_fields:
            if field not in bill_data:
                return jsonify({"error": f"Missing required field: {field}"}), 400
        
        # Ensure numeric fields are valid
        try:
            bill_data["driver_bata"] = float(bill_data["driver_bata"])
            bill_data["start_kms"] = float(bill_data["start_kms"])
            bill_data["close_kms"] = float(bill_data["close_kms"])
            bill_data["total_kms"] = float(bill_data["total_kms"])
            bill_data["rent"] = float(bill_data["rent"])
            bill_data["diesel_amount"] = float(bill_data["diesel_amount"])
            bill_data["profit_amount"] = float(bill_data["profit_amount"])
        except ValueError:
            return jsonify({"error": "Invalid numeric values"}), 400

        # Insert the new bill into the database
        bills_collection.insert_one(bill_data)

        return jsonify({"message": "Bill created successfully!"}), 201

    except Exception as e:
        return jsonify({"error": f"Error creating bill: {str(e)}"}), 500


@app.route('/view_bills', methods=['GET'])
def view_bills():
    try:
        # Fetch all bills from the MongoDB collection
        bills = list(bills_collection.find({}, {'_id': 0}))  # Exclude MongoDB ObjectId

        return jsonify(bills)

    except Exception as e:
        return jsonify({"error": f"Error fetching bills: {str(e)}"}), 500


# Vercel uses this WSGI application interface
if __name__ == '__main__':
    app.run(debug=True)
