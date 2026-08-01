from urllib.parse import urlparse
import os 
import requests
from services.tree_builder import tree_builder
from services.db_service import save_repo, update_columns
from services.github_fetcher import get_github_branch, github_headers

def parse_url(repoUrl):
    if not repoUrl: return None, None

    clean_url = repoUrl.strip().rstrip('/')
    if clean_url.endswith(".git"):
        clean_url = clean_url[:-4] 

    if not clean_url.startswith(('http://', 'https://')):
        clean_url = 'https://' + clean_url

    clean_url = urlparse(clean_url).path.strip('/')
    parts = [p for p in clean_url.split("/") if p]

    if len(parts) >=2:
        owner, name = parts[0], parts[1]
        return owner, name

    return None, None

def get_repo_structure(owner, repo_name):
    
    if not owner or not repo_name:
        return None, None, None, None
    
    headers = github_headers()

    # the first request to find what's the branch that we are working with 
    response = get_github_branch(owner, repo_name)
    if not response:
        print(f"There was an error getting the branch of the repo: {repo_name}")
        return None, None, None, None
    
    default_branch = response.get("default_branch", "main")
    description = response.get("description", "No description available.")
    print(f"The default branch for this repo is: {default_branch}")

    # now this is the second request to get the tree structure
    tree_url = f"https://api.github.com/repos/{owner}/{repo_name}/git/trees/{default_branch}?recursive=1"
    tree = requests.get(tree_url, headers=headers)
    if tree.status_code != 200:
        print(f"There was an error getting the tree structure: {repo_name}")
        return None, None, None, None

    # extracting the file paths for summarizing
    file_paths = [item['path'] for item in tree.json().get("tree", []) if item['type'] == 'blob']

    tree_json = tree_builder(tree.json())
    return tree_json, default_branch, description, file_paths 
