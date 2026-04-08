from rest_framework import serializers
from .models import Repository
from ..insights.serializers import InsightSerializer



class RepositorySerializer(serializers.ModelSerializer):
    insights = InsightSerializer(many=True, read_only=True)
    
    class Meta:
        model = Repository
        fields = ['id', 'name','full_name',  'url', 'description', 'created_at', 'updated_at', 'insights']
        