from rest_framework import serializers
from .models import Repository

class RepositorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Repository
        # We removed 'description' and 'user', and added 'guest_id'
        fields = [
            'id', 
            'guest_id', 
            'name', 
            'full_name', 
            'owner_name',
            'github_url', 
            'github_created_at', 
            'db_added_at',
            'stars_count',
            'forks_count',
            'language'
        ]