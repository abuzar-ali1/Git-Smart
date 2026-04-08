from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from .models import Repository
from .serializers import RepositorySerializer
from .services import fetch_and_sync_github_repos
from rest_framework.permissions import AllowAny 
from django.contrib.auth.models import User
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


class RepositoryViewSet(viewsets.ModelViewSet):
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer
    filter_backends = [DjangoFilterBackend, filters.SearchFilter]
    filterset_fields = ['language'] 
    search_fields = ['name', 'description'] 

    @action(detail=False, methods=['post'])
    def sync_github(self, request):
        username = request.data.get('github_username')
        
        # 1. Check if username was provided
        if not username:
            return Response({"error": "github_username is required"}, status=400)

        user = request.user if request.user.is_authenticated else User.objects.first()
        
        if not user:
            return Response({"error": "No user exists. Run 'python manage.py createsuperuser'"}, status=500)

        try:
            # 3. Call the service
            repos = fetch_and_sync_github_repos(user, username)
            return Response({"status": "success", "count": len(repos)})
        except Exception as e:
            # 4. This will tell you exactly why it's crashing in the Postman response!
            return Response({"error": str(e)}, status=500)