from flask import Flask, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for the frontend origin
CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        "status": "healthy",
        "message": "Connected to Flask Backend",
        "version": "1.0.0"
    })

if __name__ == '__main__':
    app.run(debug=True, port=5000)
