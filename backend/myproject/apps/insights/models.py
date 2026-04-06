from django.db import models
from apps.repositories.models import Repository

class ProjectInsight(models.Model):
    # Link this insight to a specific repository
    repository = models.OneToOneField(Repository, on_delete=models.CASCADE, related_name="insight")
    
    # The AI Content
    analysis_text = models.TextField() # The professional summary
    key_achievements = models.JSONField(default=list) # A list of cool things the AI found
    suggested_tags = models.JSONField(default=list) # e.g., ["React", "API", "Cloud"]
    
    # Metadata
    ai_model_used = models.CharField(max_length=50, default="gemini-pro")
    generated_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Insight for {self.repository.name}"