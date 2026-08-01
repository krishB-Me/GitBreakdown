from config import Config
from supabase import Client, create_client

# setting up the client
supabase: Client = create_client(Config.SUPABASE_URL, Config.SUPABASE_KEY)

"""
    Now we need to create five methods here two for each table we have
    Out of the two one is for getting the data out of a table and 
    other onw if for inserting or upserting the data into a table
"""
def get_repo_data(owner, repo):
    response = (
        supabase.table('repositories')
        .select("*")
        .eq("owner", owner)
        .eq("repo", repo)
        .execute()
    )
    return response.data[0] if response.data else None

def save_repo(owner, repo, branch):
    payload = {
        "owner":owner,
        "repo":repo,
        "default_branch":branch
    }
    response = (
        supabase.table('repositories')
        .upsert(payload, on_conflict="owner, repo")
        .execute()
    )
    return response.data[0]

def get_file_data(repo_id, path):
    response = (
        supabase.table('files')
        .select("*")
        .eq("repo_id", repo_id)
        .eq("path", path)
        .execute()
    )
    
    return response.data[0] if response.data else None

def save_file(repo_id, path, content, summary=None):
    payload = {
        "repo_id": repo_id,
        "path": path,
        "content": content,
        "summary": summary
    }
    response = (
        supabase.table("files")
        .upsert(payload, on_conflict="repo_id, path")
        .execute()
    )
    return response.data[0]
    
def update_columns(table, column, value, repo_id=None, path=None, owner=None, repo=None):

    if table == "repositories":
        if not owner or not repo:
            raise ValueError("Owner and repo is required for updating a table")

        response = (
            supabase.table('repositories')
            .update({
                column: value
            })
            .eq('owner', owner)
            .eq('repo', repo)
            .execute()
        )
        return response.data[0] if response.data else None

    elif table == "files":
        if not repo_id or not path:
            raise ValueError("Repo ID and path is required for updating a file")
        response = (
            supabase.table("files")
            .update({
                column: value
            })
            .eq("repo_id", repo_id)
            .eq("path", path)
            .execute()
        )
        return response.data[0] if response.data else None

    else:
        raise ValueError(f"Invalid table name: {table}")