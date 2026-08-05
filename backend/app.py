import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from dotenv import load_dotenv
from routes.repo import repo_bp
import json
from constants import IGNORED_EXTENSIONS

# Load environment variables from .env file
load_dotenv() 

DATABASE_URL = os.getenv("SUPABASE_URL") 
FLASK_ENV = os.getenv("FLASK_ENV", "development") 

def export_ext_to_json(app):
    json_path = os.path.join(app.root_path, '../frontend/src/utils/IgnoredExtensions.json')
    
    try:
        os.makedirs(os.path.dirname(json_path), exist_ok=True) 
        with open(json_path, 'w') as f:
            json.dump(list(IGNORED_EXTENSIONS), f, indent=2)
        print(f"Synced {len(IGNORED_EXTENSIONS)} ignored extensions to React!")
    except Exception as e:
        print(f"Failed to sync ignored extensions JSON: {e}")

def create_app():
    app = Flask(__name__)

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

    export_ext_to_json(app)
    CORS(app, resources={r"/*": {"origins": "*"}})
    app.register_blueprint(repo_bp, url_prefix='/api')

    return app

if __name__ == "__main__":
    # Run the development server on port 5000
    app = create_app() 
    app.run(host="0.0.0.0", port=5000, debug=(FLASK_ENV == "development")) 