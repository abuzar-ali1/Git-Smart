import os
import requests

def fetch_github_repo_data(repo_url):
    """Fetches data from GitHub and handles rate limits."""
    repo_url = repo_url.rstrip('/')
    parts = repo_url.split('/')
    if len(parts) < 2:
        return None
        
    owner, repo = parts[-2], parts[-1]
    api_url = f"https://api.github.com/repos/{owner}/{repo}"
    
    headers = {"Accept": "application/vnd.github.v3+json"}
    
    github_token = os.environ.get("GITHUB_TOKEN")
    if github_token:
        headers["Authorization"] = f"Bearer {github_token}"
    
    try:
        response = requests.get(api_url, headers=headers)
        if response.status_code == 200:
            return response.json()
        else:
            print(f"🚨 GITHUB ERROR: {response.status_code} - {response.text}")
            return None
    except Exception as e:
        print(f"🚨 NETWORK ERROR: {str(e)}")
        return None