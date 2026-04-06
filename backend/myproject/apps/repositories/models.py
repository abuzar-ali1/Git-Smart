from django.db import models
from django.conf import settings

class Repository(models.Model):
    # Link this repo to a specific user
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name="repositories")
    
    # Data from GitHub API
    github_id = models.PositiveIntegerField(unique=True)
    name = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255)
    html_url = models.URLField()
    description = models.TextField(null=True, blank=True)
    
    # Stats
    stargazers_count = models.IntegerField(default=0)
    language = models.CharField(max_length=100, null=True, blank=True)
    
    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.full_name