import os
import requests
from groq import Groq


client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

def get_github_repo_data(repo_url):
  
    try:
        parts = repo_url.rstrip('/').split('/')
        owner, repo = parts[-2], parts[-1]
        api_url = f"https://api.github.com/repos/{owner}/{repo}"
        
        headers = {
            "Accept": "application/vnd.github.v3+json",
        }
        
        response = requests.get(api_url, headers=headers)
        if response.status_code == 200:
            return response.json()
        return None
    except Exception:
        return None

def analyze_repo_with_groq(repo_url):
    github_meta = get_github_repo_data(repo_url)
    if not github_meta:
        return {"error": "Could not find repository metadata. Please check the URL."}

    # Prepare data for AI
    repo_name = github_meta.get("name")
    owner = github_meta.get("owner", {}).get("login")
    description = github_meta.get("description", "No description provided.")
    language = github_meta.get("language", "Not specified")
    stars = github_meta.get("stargazers_count", 0)

    try:
        chat_completion = client.chat.completions.create(
            model="llama3-8b-8192", 
            messages=[
                {
                    "role": "system",
                    "content": (
                        "You are an expert Senior Software Architect. Analyze the provided GitHub repository. "
                        "Format your response in clean Markdown. Use bolding for key terms. "
                        "Structure your analysis with sections:  Overview,  Architecture, and  Growth Roadmap."
                    )
                },
                {
                    "role": "user",
                    "content": (
                        f"Analyze this repository: {repo_name} by {owner}.\n"
                        f"Description: {description}\n"
                        f"Primary Language: {language}\n"
                        f"Popularity: {stars} stars.\n"
                        "Please provide a deep architectural summary and project health analysis."
                    )
                }
            ],
            temperature=0.5,
            max_tokens=1024,
        )

        ai_markdown = chat_completion.choices[0].message.content

        return {
            "repo_details": {
                "name": repo_name,
                "full_name": github_meta.get("full_name"),
                "github_url": github_meta.get("html_url"),
                "owner_name": owner,
                "stars_count": stars,
                "forks_count": github_meta.get("forks_count"),
                "language": language,
                "github_created_at": github_meta.get("created_at"),
            },
            "ai_analysis": ai_markdown
        }

    except Exception as e:
        return {"error": f"Groq Engine Error: {str(e)}"}