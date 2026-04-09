from django.contrib.auth.models import AbstractUser
from django.db import models
from django.db.models import JSONField # To store language stats

class User(AbstractUser):
    # Basic Profile Info
    github_username = models.CharField(max_length=100, unique=True, null=True)
    avatar_url = models.URLField(blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=100, blank=True, null=True)
    blog_url = models.URLField(blank=True, null=True)
    
    # Statistics (For your Dashboard)
    total_stars = models.IntegerField(default=0)
    total_repos = models.IntegerField(default=0)
    followers_count = models.IntegerField(default=0)
    
    # Complex Data (The "Scalability" Part)
    # Stores: {"Python": 45, "React": 30, "TypeScript": 25}
    top_languages = JSONField(default=dict, blank=True)
    
    # Stores: {"total_contributions": 450, "current_streak": 12, "longest_streak": 25}
    github_stats = JSONField(default=dict, blank=True)

    def __str__(self):
        return f"{self.username} ({self.github_username})"