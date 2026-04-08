import requests
import os
from .models import Repository

def fetch_and_sync_github_repos(user, github_username):
    """
    Fetches repositories from GitHub for a specific username 
    and saves/updates them in our database.
    """
    token = os.getenv("GITHUB_TOKEN")
    headers = {"Authorization": f"token {token}"} if token else {}
    
    url = f"https://api.github.com/users/{github_username}/repos?per_page=100"
    response = requests.get(url, headers=headers)
    
    if response.status_code != 200:
        return {"error": "Failed to fetch from GitHub", "status": response.status_code}

    repos_data = response.json()
    synced_repos = []

    for repo in repos_data:
        # If the github_id exists, it updates the info. If not, it creates a new row.
        obj, created = Repository.objects.update_or_create(
            github_id=repo['id'],
            defaults={
                'user': user,
                'name': repo['name'],
                'full_name': repo['full_name'],
                'html_url': repo['html_url'],
                'description': repo.get('description'),
                'stargazers_count': repo['stargazers_count'],
                'language': repo.get('language'),
            }
        )
        synced_repos.append(obj)

    return synced_repos