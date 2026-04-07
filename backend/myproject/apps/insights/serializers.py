from rest_framework import serializers
from .models import ProjectInsight 



class ProjectInsightSerializer(serializers.ModelSerailizer):
    class Meta:
        model = ProjectInsight
        fields = '__all__'


