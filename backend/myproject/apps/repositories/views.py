from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Repository
from .serializers import RepositorySerializer
from .services import fetch_and_sync_github_repos 

class RepositoryViewSet(viewsets.ModelViewSet):
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer

    @action(detail=False, methods=['post'])
    def sync_github(self, request):
        # For now, we manually provide the username. 
        # Later, this will come from the logged-in user's profile!
        username = request.data.get('github_username')
        
        if not username:
            return Response({"error": "Github username is required"}, status=status.HTTP_400_BAD_REQUEST)

        repos = fetch_and_sync_github_repos(request.user, username)
        
        if isinstance(repos, dict) and "error" in repos:
            return Response(repos, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        return Response({"message": f"Successfully synced {len(repos)} repositories!"})