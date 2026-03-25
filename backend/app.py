from flask import Flask, jsonify, request
from flask_cors import CORS
import os
import dotenv
from flask_pymongo import PyMongo

dotenv = dotenv.load_dotenv()
monguri = os.getenv('MONGO_URI')

app = Flask(__name__)
# Enable CORS for the frontend origin
app.config['MONGO_URI'] = monguri
mongo = PyMongo(app)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "status": "healthy",
        "message": "Connected to Flask Backend",
        "version": "1.0.0"
    })


@app.route("/")
def home_page():
    try:
        mongo.cx.admin.command('ping')
        db_status = "ONLINE"
    except Exception as e:
        db_status = "OFFLINE"
    
    return jsonify({
        "status": "healthy",
        "message": "Connected to Flask Backend",
        "version": "1.0.0",
        "db_status": db_status
    })


@app.route("/api/signup", methods=['POST'])
def signup():
    try:
        data = request.get_json()
        if mongo.db is None:
            print("NO DB IM SOO COOKED")
        else:
            print(f"Connected to- {mongo.db.name}")
        mongo.db.users.insert_one(data)
        return jsonify({"message": "User added successfully"}), 200
    except Exception as e:
        print(f"FUCKED UP: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/login", methods=['POST'])
def login():
    try:
        data = request.get_json()
        if mongo.db is None:
            print("NO DB AGAIN")
        else:
            print(f"Connected to {mongo.db.name}")
        user = mongo.db.users.find_one(data)
        if user:
            return jsonify({"message": "User found successfully", "user": {"email": data.get("email")}}), 200
        else:
            return jsonify({"error": "Invalid credentials"}), 401
    except Exception as e:
        print(f"FUCKED UP: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/seller/add_products", methods=['POST'])
def add_products_seller():
    try:
        data = request.get_json()
        if mongo.db is None:
            print("Error DB not intialized")
        else:
            print(f"Connected to- {mongo.db.name}")
        mongo.db.products.insert_one(data)
        return jsonify({"message": "Product added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500



@app.route("/api/delete_products", methods=['POST'])
def delete_products():
    try:
        data = request.get_json()
        if mongo.db is None:
            print("NO DB AAAA")
        else:
            print("MONGO DB IS HERE")
        mongo.db.products.delete_one(data)
        return jsonify({"message": "Product deleted successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/add_products", methods=['POST'])
def add_products():
    try:
        data = request.get_json()
        if mongo.db is None:
            print("Error DB not intialized")
        else:
            print(f"Connected to- {mongo.db.name}")
        mongo.db.products.insert_one(data)
        return jsonify({"message": "Product added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/products", methods=['GET'])
def get_products():
    try:
        if mongo.db is None:
            return jsonify({"error": "DB not initialized"}), 500
        products = list(mongo.db.products.find({}, {"_id": 0}))
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
