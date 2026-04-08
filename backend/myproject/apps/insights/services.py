import os
import google.generativeai as genai
from django.conf import settings
from .models import Insight

# Configure the API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

def generate_repo_insight(repository):
    """
    Sends repo data to Gemini and saves the analysis.
    """
    model = genai.GenerativeModel('gemini-2.5-flash')    
    # The "Secret Sauce" - The Prompt
    prompt = f"""
    Analyze the following GitHub repository and provide a professional summary for a developer portfolio.
    Project Name: {repository.name}
    Description: {repository.description or 'No description provided'}
    Primary Language: {repository.language or 'Not specified'}
    
    Provide the output in this format:
    Summary: (A 2-3 sentence professional overview)
    Achievements: (3 bullet points of technical highlights)
    Tags: (5 relevant tech keywords as a list)
    """

    response = model.generate_content(prompt)
    
    # Save the result to our Insight model
    # We use update_or_create so we can "Refresh" the insight later if needed
    insight, created = Insight.objects.update_or_create(
        repository=repository,
        defaults={
            'analysis_text': response.text,
            'ai_model_used': 'gemini-1.5-flash'
        }
    )
    
    return insight