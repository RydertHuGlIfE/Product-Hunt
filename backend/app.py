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


@app.route("/api/signup/seller", methods=['POST'])
def signup_seller():
    try:
        data = request.get_json()
        if mongo.db is None:
            print("NO DB IM SOO COOKED")
        else:
            print(f"Connected to- {mongo.db.name}")
        data['role'] = 'seller'
        mongo.db.users.insert_one(data)
        return jsonify({"message": "Seller added successfully"}), 200
    except Exception as e:
        print(f"FUCKED UP: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/login/seller", methods=['POST'])
def login_seller():
    try:
        data = request.get_json()
        if mongo.db is None:
            print("NO DB AGAIN")
        else:
            print(f"Connected to {mongo.db.name}")
        data['role'] = 'seller'
        user = mongo.db.users.find_one(data)
        if user:
            return jsonify({"message": "Seller found successfully", "user": {"email": data.get("email"), "role": "seller"}}), 200
        else:
            return jsonify({"error": "Invalid seller credentials"}), 401
    except Exception as e:
        print(f"FUCKED UP: {e}")
        return jsonify({"error": str(e)}), 500



@app.route("/api/signup/consumer", methods=['POST'])
def signup_consumer():
    try:
        data = request.get_json()
        if mongo.db is None:
            print("NO DB IM SOO COOKED")
        else:
            print(f"Connected to- {mongo.db.name}")
        data['role'] = 'consumer'
        mongo.db.users.insert_one(data)
        return jsonify({"message": "Consumer added successfully"}), 200
    except Exception as e:
        print(f"FUCKED UP: {e}")
        return jsonify({"error": str(e)}), 500


@app.route("/api/login/consumer", methods=['POST'])
def login_consumer():
    try:
        data = request.get_json()
        if mongo.db is None:
            print("NO DB AGAIN")
        else:
            print(f"Connected to {mongo.db.name}")
        data['role'] = 'consumer'
        user = mongo.db.users.find_one(data)
        if user:
            return jsonify({"message": "Consumer found successfully", "user": {"email": data.get("email"), "role": "consumer"}}), 200
        else:
            return jsonify({"error": "Invalid consumer credentials"}), 401
    except Exception as e:
        print(f"FUCKED UP: {e}")
        return jsonify({"error": str(e)}), 500



@app.route("/api/consumer/view_displayed_products", methods=['POST'])
def view_displayed_products():                          # ye waala function displayed products ke detail nikalta hai 
    try:
        data = request.get_json()
        if mongo.db is None:
            return jsonify({"error": "DB not initialized"}), 500

        # Return FULL product details (excluding _id)
        product = mongo.db.products.find_one({'name': data.get('name')}, {"_id": 0})
        if product:
            return jsonify({
                "message": "Product found", 
                "product": product
            }), 200
        else:
            return jsonify({"error": "Product not found"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/seller/add_products", methods=['POST'])
def add_products_seller():
    try:
        data = request.get_json()
        if mongo.db is None:
            return jsonify({"error": "DB not initialized"}), 500
        
        data['seller_email'] = data.pop('email', None) 
        
        mongo.db.products.insert_one(data)
        return jsonify({"message": "Product added successfully"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/products", methods=['GET'])                    #ye waala actual feed product list display 
def get_products():
    try:
        if mongo.db is None:
            return jsonify({"error": "DB not initialized"}), 500
        # Return ALL products for the global Home feed
        products = list(mongo.db.products.find({}, {"_id": 0}))
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/seller/products", methods=['GET'])
def get_seller_products():
    try:
        if mongo.db is None:
            return jsonify({"error": "DB not initialized"}), 500
        email = request.args.get('email')
        if not email:
            return jsonify({"error": "Email parameter required"}), 400
        # Return ONLY products belonging to this seller
        products = list(mongo.db.products.find({'seller_email': email}, {"_id": 0}))
        return jsonify(products), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@app.route("/api/delete_products", methods=['POST'])
def delete_products():
    try:
        data = request.get_json()
        name = data.get('name')
        seller_email = data.get('email')
        
        if mongo.db is None:
            return jsonify({"error": "DB not initialized"}), 500
            
        # Ensure only the owner can delete the product
        result = mongo.db.products.delete_one({'name': name, 'seller_email': seller_email})
        
        if result.deleted_count > 0:
            return jsonify({"message": "Product deleted successfully"}), 200
        else:
            return jsonify({"error": "Product not found or unauthorized"}), 404
    except Exception as e:
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
