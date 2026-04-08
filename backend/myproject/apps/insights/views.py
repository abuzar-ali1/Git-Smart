from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from ..repositories.models import Repository # Import the repo model
from .models import Insight
from .serializers import InsightSerializer
from .services import generate_repo_insight

class InsightViewSet(viewsets.ModelViewSet):
    queryset = Insight.objects.all()
    serializer_class = InsightSerializer

    @action(detail=False, methods=['post'])
    def generate(self, request):
        repo_id = request.data.get('repo_id')
        
        if not repo_id:
            return Response({"error": "repo_id is required"}, status=400)

        try:
            # Find the repo in our database
            repo = Repository.objects.get(id=repo_id)
            
            # Generate the insight
            insight = generate_repo_insight(repo)
            
            return Response({
                "status": "success",
                "insight": insight.analysis_text
            })
        except Repository.DoesNotExist:
            return Response({"error": "Repository not found"}, status=404)
        except Exception as e:
            return Response({"error": str(e)}, status=500)