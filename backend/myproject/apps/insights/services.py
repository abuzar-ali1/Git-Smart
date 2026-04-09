from google import genai
from google.genai import errors 
import os
import datetime

def generate_repo_insight(repo_data):
    api_key = os.environ.get("GEMINI_API_KEY") 
    client = genai.Client(api_key=api_key)    
    current_date = datetime.date.today().isoformat()
    prompt = f"Today's date is {current_date}. Analyze this repo data: {repo_data}"
    try:
        response = client.models.generate_content(
            model='gemini-2.5-flash',            
            contents=prompt
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