import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from routes.repo import repo_bp

# Load environment variables from .env file
load_dotenv() 

DATABASE_URL = os.getenv("SUPABASE_URL")
FLASK_ENV = os.getenv("FLASK_ENV", "development") 

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})  # Enables Cross-Origin Resource Sharing for frontend communication

# These are the API blueprints for the app
app.register_blueprint(repo_bp, url_prefix='/api')

@app.route("/")
def index():
    """
    Base health-check route.
    """
    return jsonify({
        "status": "healthy",
        "message": "Flask server is running!",
        "database_configured": DATABASE_URL is not None
    })

if __name__ == "__main__":
    # Run the development server on port 5000
    app.run(host="0.0.0.0", port=5000, debug=(FLASK_ENV == "development"))
