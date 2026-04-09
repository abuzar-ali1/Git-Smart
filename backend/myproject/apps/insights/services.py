from google import genai
from google.genai import errors 

def generate_repo_insight(repo_data):
    client = genai.Client(api_key="YOUR_API_KEY")
    
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',            contents=f"Analyze this repo: {repo_data}"
        )
        return response.text
        
    except errors.ServerError as e:
        # This catches the 503 error specifically
        print(f"Gemini is busy: {e}")
        return "The AI is currently experiencing high demand. Please try again in a minute!"
        
    except Exception as e:
        # This catches any other random errors
        print(f"Unexpected AI error: {e}")
        return "AI analysis is currently unavailable for this repository."