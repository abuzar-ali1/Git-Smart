import requests

def sync_user_github_profile(user):
    """
    Fetches the full profile data for a user and updates the DB.
    """
    url = f"https://api.github.com/users/{user.github_username}"
    response = requests.get(url)
    
    if response.status_code == 200:
        data = response.json()
        
        # Update our Custom User fields
        user.avatar_url = data.get('avatar_url')
        user.bio = data.get('bio')
        user.followers_count = data.get('followers')
        user.total_repos = data.get('public_repos')
        user.location = data.get('location')
        user.save()
        
        return True
    return False