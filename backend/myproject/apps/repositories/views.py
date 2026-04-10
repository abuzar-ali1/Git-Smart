from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response

from .models import Repository
from ..insights.models import Insight 
from .serializers import RepositorySerializer

# Import the two separate services!
from .services import fetch_github_repo_data
from ..insights.services import generate_repo_insight

class RepositoryViewSet(viewsets.ModelViewSet):
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer

    @action(detail=False, methods=['post'], url_path='analyze_new_repo')
    def analyze_new_repo(self, request):
        repo_url = request.data.get('repo_url')
        refresh = request.data.get('refresh', False)

        if not repo_url:
            return Response({"error": "repo_url is required"}, status=status.HTTP_400_BAD_REQUEST)

        # 1. Fetch from GitHub (Using repositories service)
        github_data = fetch_github_repo_data(repo_url)

        if not github_data:
            return Response({
                "repo_details": {
                    "name": "N/A", "owner_name": "Unknown", "stars_count": 0, "forks_count": 0, "language": "N/A"
                },
                "ai_analysis": "### ⚠️ GitHub API Error\n\nWe could not fetch metadata. The URL is incorrect, the repo is private, or you hit the rate limit.",
                "refreshed": False
            })

        owner_name = github_data.get("owner", {}).get("login", "")
        repo_name = github_data.get("name", "")
        
        # 2. Save Repo to DB
        repo, _ = Repository.objects.get_or_create(
            full_name=github_data.get("full_name", f"{owner_name}/{repo_name}"),
            defaults={
                "name": repo_name,
                "github_url": github_data.get("html_url"),
                "github_created_at": github_data.get("created_at"),
                "owner_name": owner_name,
                "stars_count": github_data.get("stargazers_count", 0),
                "forks_count": github_data.get("forks_count", 0),
                "language": github_data.get("language", "")
            }
        )

        # 3. Check DB for existing Insight
        insight = Insight.objects.filter(repository=repo).first()
        is_refreshed = False

        # 4. Generate AI Insight (Using insights service)
        if not insight or refresh:
            ai_text = generate_repo_insight(
                repo_name=repo.name,
                owner=repo.owner_name,
                description=github_data.get("description", "None"),
                language=repo.language,
                stars=repo.stars_count
            )
            
            insight, _ = Insight.objects.update_or_create(
                repository=repo,
                defaults={'analysis_text': ai_text}
            )
            is_refreshed = True

        # 5. Return to Next.js
        return Response({
            "repo_details": {
                "name": repo.name,
                "owner_name": repo.owner_name,
                "stars_count": repo.stars_count,
                "forks_count": repo.forks_count,
                "language": repo.language,
                "github_created_at": repo.github_created_at,
                "github_url": repo.github_url,
                "full_name": repo.full_name,
            },
            "ai_analysis": insight.analysis_text,
            "refreshed": is_refreshed
        })