import os
import requests
import base64
from constants import *
from services.db_service import save_file, get_repo_data

def github_headers():
    token = os.getenv("GITHUB_TOKEN")
    headers = {
        "Accept": "application/vnd.github.v3+json" # this is for the github API kind of like it's config
    }
    if token:
        headers["Authorization"] = f"token {token}"
    return headers

def get_readme(paths, owner, repo, branch):
    location, readme = None, None
    paths = set(paths)
    for variant in README_TARGETS: 
        if variant in paths:
            readme = variant 
            location = readme
            break
    
    if not readme:
        for path in paths:
            pieces = path.strip('/').split('/')
            if pieces[-1].lower().startswith('readme'):
                readme = pieces[-1]
                location = path 
                break

    # Hopefully we will know how README is present in this repo (if it's present)
    if not readme:
        print("README doesn't exist in the repo.")
        return ""
    response = get_file_response(owner, repo, branch, location)
    if not response: return ""

    # saving the readme in the database
    readme_content = decoding(response, "README")
    save_in_db(owner, repo, location, readme_content)

    return readme_content
    
def get_manifest(paths, owner, repo, branch):
    if not all([paths, branch]):
        print("No tree or branch available.")
        return ""
    # we need to iterate over paths and find the first one that matches in our list
    location = ""
    paths = set(paths)
    for variant in MANIFEST_TARGETS:
        if variant in paths:
            location = variant
            break
    
    if not location:
        for path in paths:
            pieces = path.strip('/').split('/')
            if pieces[-1].lower() in MANIFEST_TARGETS:
                location = path
                break
    
    if not location:
        print("Manifest file doesn't exist in the repo.")
        return ""
    
    # calling the API to get the manifest file
    response = get_file_response(owner, repo, branch, location)
    if not response:
        return ""

    # saving the manifest file
    manifest_content = decoding(response, "Manifest file")
    save_in_db(owner, repo, location, manifest_content)

    return manifest_content

def get_meaningful_path(paths):
    clean_paths = []
    if not paths:
        print("Repository is empty.")
        return []
    for path in paths:
        if not path: continue
        if any(directory in path for directory in IGNORED_DIRECTORIES):
            continue
        _, ext = os.path.splitext(path)
        if ext.lower() in IGNORED_EXTENSIONS:
            continue 
        clean_paths.append(path)   
    
    return clean_paths

def decoding(response, file_label="File"):
    if not isinstance(response, dict):
        print(f"Invalid response for {file_label}: {response}")
        return ""
    encoded_content = response.get("content", "")
    if not encoded_content:
        # we need to download it if necessary
        size = response.get('size', 0)
        if size == 0:
            print(f"{file_label} is empty.")
            return ""

        else:
            print(f"{file_label} is of size {size}, downloading it.")
            url = response.get("download_url", "")
            if not url: return ""
            raw_text = requests.get(url)
            if raw_text.status_code != 200: return ""
            decoded_text = raw_text.text
    else:
        clean_b64 = encoded_content.replace("\n", "").replace("\r", "")
        decoded_text = base64.b64decode(clean_b64).decode("utf-8", errors="ignore")     

    return decoded_text

def get_file_response(owner, repo, branch, location):
    headers = github_headers()
    response = requests.get(f"https://api.github.com/repos/{owner}/{repo}/contents/{location}?ref={branch}", headers = headers)
    if response.status_code != 200: return ""
    return response.json()

def get_github_branch(owner, repo):
    headers = github_headers()
    response = requests.get(f"https://api.github.com/repos/{owner}/{repo}", headers=headers)
    if response.status_code != 200:
        print(f"There was an error getting the branch of the repo: {repo}")
        return None
    return response.json()

def save_in_db(owner, repo, location, content):
    repo_data = get_repo_data(owner, repo)
    if not repo_data: 
        print(f"No data found for repo {repo} owned by {owner}")
        return ""
    repo_id = repo_data['id']
    save_file(repo_id, location, content)