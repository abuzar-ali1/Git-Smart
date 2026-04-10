from rest_framework import viewsets
from rest_framework.response import Response
from .models import Repository
from ..insights.models import RepoAnalysis
from .serializers import RepositorySerializer
from .services import fetch_github_repo_data
from ..insights.services import analyze_repo_with_groq 
from rest_framework.decorators import action


class RepositoryViewSet(viewsets.ModelViewSet):
    serializer_class = RepositorySerializer

    @action(detail=False, methods=['post'])
    def analyze_new_repo(self, request):
        repo_url = request.data.get('repo_url')
        guest_id = request.data.get('guest_id')
        force_refresh = bool(request.data.get('refresh', False))

        if not repo_url or not guest_id:
            return Response({"error": "I need a URL and a Guest ID!"}, status=400)

        parts = repo_url.rstrip('/').split('/')
        repo_path = f"{parts[-2]}/{parts[-1]}"

        github_data = fetch_github_repo_data(repo_path)
        if not github_data:
            return Response({"error": "Could not find that repo on GitHub!"}, status=404)

        cached_analysis = RepoAnalysis.objects.filter(repo_full_name=repo_path).first()

        if not cached_analysis or force_refresh:
            ai_text = analyze_repo_with_groq(github_data)
            cached_analysis, _ = RepoAnalysis.objects.update_or_create(
                repo_full_name=repo_path,
                defaults={
                    'ai_summary': ai_text,
                    'top_languages': {"primary": github_data.get('language')}
                }
            )

        defaults = {
            'name': github_data.get('name'),
            'owner_name': github_data.get('owner_name'),
            'github_url': github_data.get('html_url'),
            'github_created_at': github_data.get('created_at'),
            'stars_count': github_data.get('stars', 0),
            'forks_count': github_data.get('forks', 0),
            'language': github_data.get('language'),
        }

        repo_obj, _ = Repository.objects.get_or_create(
            guest_id=guest_id,
            full_name=repo_path,
            defaults=defaults
        )

        return Response({
            "repo_details": RepositorySerializer(repo_obj).data,
            "ai_analysis": cached_analysis.ai_summary,
            "refreshed": force_refresh,
        })