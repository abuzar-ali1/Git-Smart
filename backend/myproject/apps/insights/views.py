from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..repositories.models import Repository # Import the repo model
from .models import Insight
from .serializers import InsightSerializer
from .services import analyze_repo_with_groq

class InsightViewSet(viewsets.ModelViewSet):
    queryset = Insight.objects.all()
    serializer_class = InsightSerializer

    # insights/views.py

    @action(detail=False, methods=['post'])
    def generate(self, request):
        repo_id = request.data.get('repo_id')
        try:
            repo = Repository.objects.get(id=repo_id)
        # Calling your Groq service
            insight_instance = analyze_repo_with_groq(repo)
        
        # We MUST return the key 'ai_analysis' for Next.js to see it
            return Response({
                "repo_details": {
                    "name": repo.name,
                    "owner_name": getattr(repo, 'owner_name', 'Unknown'),
                    "stars_count": getattr(repo, 'stars_count', 0),
                    "forks_count": getattr(repo, 'forks_count', 0),
                    "language": getattr(repo, 'language', 'N/A'),
                },
                "ai_analysis": str(insight_instance.analysis_text), # Ensure this is a string
                "refreshed": True
            })
        except Exception as e:
            return Response({"error": str(e)}, status=500)