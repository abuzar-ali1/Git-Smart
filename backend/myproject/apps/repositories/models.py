from django.db import models

class Repository(models.Model):
    guest_id = models.CharField(max_length=100, db_index=True) 
    
    # GitHub Data
    name = models.CharField(max_length=255)
    full_name = models.CharField(max_length=255 , unique=True) 
    owner_name = models.CharField(max_length=255, null=True, blank=True)
    github_url = models.URLField(max_length=500)
    
    github_created_at = models.DateTimeField(null=True)
    db_added_at = models.DateTimeField(auto_now_add=True)
    
    # Additional metadata
    stars_count = models.PositiveIntegerField(default=0)
    forks_count = models.PositiveIntegerField(default=0)
    language = models.CharField(max_length=100, null=True, blank=True)

    def __str__(self):
        return f"{self.full_name} (Guest: {self.guest_id})"