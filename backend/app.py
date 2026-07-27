import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
import psycopg2
import requests

# Load environment variables from .env file
load_dotenv() 

app = Flask(__name__)
CORS(app)  # Enables Cross-Origin Resource Sharing for frontend communication

# Retrieve environment variables
DATABASE_URL = os.getenv("SUPABASE_API_URL")
FLASK_ENV = os.getenv("FLASK_ENV", "development")

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

# TODO: Add your repository analysis routes here
# @app.route("/api/analyze", methods=["POST"])
# def analyze():
#     pass

if __name__ == "__main__":
    # Run the development server on port 5000
    app.run(host="0.0.0.0", port=5000, debug=(FLASK_ENV == "development"))
