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

# Vercel uses this WSGI application interface
if __name__ == '__main__':
    app.run(debug=True)
