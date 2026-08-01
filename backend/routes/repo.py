import requests
from flask import Blueprint, jsonify, request
import os
from services.github_services import *
from services.ai_service import *
from services.db_service import get_repo_data, save_file, get_file_data, save_repo, update_columns
from services.github_fetcher import get_file_response, decoding
from services.lazy_summary import lazy_summarizer

# Retrieve environment variables
DATABASE_URL = os.getenv("SUPABASE_URL")
DATABASE_KEY = os.getenv("SUPABASE_KEY")
FLASK_ENV = os.getenv("FLASK_ENV", "development")

repo_bp = Blueprint("repo", __name__)

@repo_bp.route("/analyze", methods=["GET", "POST"]) 
def analyze_repo():
    response = None
    data = request.get_json(silent=True) or {}
    repo_url = data.get("url")
    print("Analyzing repository: ",repo_url)

    # Now we need to call the github api to get the flat structure for the repo
    owner, repo_name = parse_url(repo_url) 
    if not owner or not repo_name:
        return jsonify({"error": "Invalid repository URL"}), 400

    tree, branch, description, tree_paths = get_repo_structure(owner, repo_name)
    if not tree:
        return jsonify({"error": "Failed to retrieve repository structure"}), 400
 
    repo_data = get_repo_data(owner, repo_name)
    if repo_data and repo_data["overall_summary"]: # if the repo is already in the database then we don't need to fetch the tree structure 
        summary = repo_data["overall_summary"]
        response = {"summary": summary, "tree":tree} 
        
    if not response:
        save_repo(owner, repo_name, branch)
        summary = summarize(description, tree_paths, branch, owner, repo_name)
        response = {"summary": summary, "tree": tree} 
        
        # update columns in db with the generated summary
        if summary and summary != "Unable to generate summary.":
            update_columns("repositories", "overall_summary", summary, owner=owner, repo=repo_name)
            update_columns("repositories", "description", description, owner=owner, repo=repo_name)
    
    return jsonify(response), 200

@repo_bp.route("/lazy-fetch", methods=["GET", "POST"])
def lazy_fetch():
    data = request.get_json(silent=True) or {}
    path = data.get("path")
    url = data.get('url')

    if not path or not url: return jsonify({"error": "Invalid path or URL"}), 400
    
    owner, repo = parse_url(url)
    if not all([owner, repo]):
        return jsonify({"error": "URL from frontend is not valid."}), 400

    # get data from db
    repo_data = get_repo_data(owner, repo)
    if not repo_data:
        return jsonify({"error": "Repository not found in database"}), 404
    branch = repo_data.get('default_branch', "")
    repo_id = repo_data.get('id', None)
    if not branch or not repo_id: 
        return jsonify({"error": "No valid branch or ID in the database"}), 404

    # checking if the files are already in db
    file_data = get_file_data(repo_id, path)
    if file_data:
        return jsonify({"content": file_data.get("content", "")}), 200

    response = get_file_response(owner, repo, branch, path)
    content = decoding(response, path)
    save_file(repo_id, path, content)

    return jsonify({"content": content}), 200

@repo_bp.route("/lazy-summary", methods=["GET", "POST"])
def lazy_summary():
    data = request.get_json(silent=True) or {}
    path = data.get('path')
    url = data.get('url')
    print("we got here")
    if not all([path, url]): return jsonify({"error": "Path or URL is missing."}), 400
    owner, repo = parse_url(url)
    if not all([owner, repo]): return jsonify({"error": "URL is invalid"}), 400

    repo_data = get_repo_data(owner, repo)
    if not repo_data: return jsonify({"error": "repo not found in db"}), 404

    repo_id = repo_data.get('id')
    
    file_data = get_file_data(repo_id, path)
    if file_data and file_data.get('summary'):
        return jsonify({'summary': file_data.get('summary', "Couldn't load summary")}), 200 
    
    # get the summary for this file
    content = file_data.get('content', "") if file_data else ""
    if not content: 
       branch = repo_data.get('default_branch', "")
       if not branch:
           return jsonify({"error": "Default branch not found for repo"}), 400
       response = get_file_response(owner, repo, branch, path)
       content = decoding(response, path)
       save_file(repo_id, path, content) 
    
    # call the summarizer
    summary = lazy_summarizer(content, path, repo_id, repo)
    return jsonify({'summary': summary}), 200