import os
from groq import Groq

def generate_repo_insight(repo_name, owner, description, language, stars):
    """Takes pure data and asks Groq to analyze it."""
    client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

    try:
        chat_completion = client.chat.completions.create(
            model="llama3-8b-8192", 
            messages=[
                {
                    "role": "system",
                    "content": "You are a Senior Software Architect. Format your response in clean Markdown. Provide an Overview, Architecture, and Growth Roadmap."
                },
                {
                    "role": "user",
                    "content": f"Analyze this repo: {repo_name} by {owner}. Description: {description}. Language: {language}. Stars: {stars}."
                }
            ],
            temperature=0.5,
            max_tokens=1024,
        )
        return chat_completion.choices[0].message.content
    except Exception as e:
        return f"### ⚠️ AI Engine Error\n\nThe Groq model encountered an issue: {str(e)}"