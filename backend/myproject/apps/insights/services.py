from google import genai
import os
def generate_repo_insight(repo_data):
    # Initialize the new client
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))
    
    prompt = f"Analyze this GitHub repo: {repo_data}"
    
    # The method name is slightly different now
    response = client.models.generate_content(
        model='gemini-2.5-flash', 
        contents=prompt
    )
    return response.text