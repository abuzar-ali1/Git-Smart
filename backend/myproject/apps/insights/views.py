from rest_framework import viewsets
from .models import Insight
from .serializers import InsightSerializer

class InsightViewSet(viewsets.ModelViewSet):
    """
    Standard API access for saved AI Insights.
    Note: The actual AI generation logic is orchestrated 
    by the RepositoryViewSet to ensure GitHub data is fetched first.
    """
    queryset = Insight.objects.all()
    serializer_class = InsightSerializer