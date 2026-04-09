import requests

def fetch_github_repo_data(full_name):
    """
    Takes 'owner/repo' and returns data from GitHub API.
    """
    api_url = f"https://api.github.com/repos/{full_name}"
    response = requests.get(api_url)
    
    if response.status_code == 200:
        data = response.json()
        return {
            "name": data.get("name"),
            "description": data.get("description"),
            "language": data.get("language"),
            "stars": data.get("stargazers_count"),
            "html_url": data.get("html_url"),
            "created_at": data.get("created_at"),
        }
    return None