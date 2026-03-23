from flask import Flask, jsonify
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

if __name__ == '__main__':
    app.run(debug=True, port=5000)
