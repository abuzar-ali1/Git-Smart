from wsgiref import headers

import requests

def fetch_github_repo_data(full_name):
    api_url = f"https://api.github.com/repos/{full_name}"
    headers = {"Accept": "application/vnd.github.v3+json"}
        
        # Add this if you generate a token!
    headers["Authorization"] = f"token GITHUB_TOKEN" 
        
    response = requests.get(api_url, headers=headers)
    if response.status_code == 200:
        data = response.json()
        return {
            "name": data.get("name"),
            "description": data.get("description"),
            "language": data.get("language"),
            "stars": data.get("stargazers_count"),
            "forks": data.get("forks_count"),
            "owner_name": data.get("owner", {}).get("login"),
            "html_url": data.get("html_url"),
            "created_at": data.get("created_at"),
        }
    return None