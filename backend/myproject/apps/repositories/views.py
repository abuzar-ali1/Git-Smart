from rest_framework import viewsets
from rest_framework.response import Response
from .models import Repository
from ..insights.models import RepoAnalysis
from .serializers import RepositorySerializer
from .services import fetch_github_repo_data
from ..insights.services import generate_repo_insight 
from rest_framework.decorators import action


class RepositoryViewSet(viewsets.ModelViewSet):
    serializer_class = RepositorySerializer

    @action(detail=False, methods=['post'])
    def analyze_new_repo(self, request):
        repo_url = request.data.get('repo_url')
        guest_id = request.data.get('guest_id')

        if not repo_url or not guest_id:
            return Response({"error": "I need a URL and a Guest ID!"}, status=400)

        parts = repo_url.rstrip('/').split('/')
        repo_path = f"{parts[-2]}/{parts[-1]}"

        cached_analysis = RepoAnalysis.objects.filter(repo_full_name=repo_path).first()
        github_data = None

        if not cached_analysis:
            github_data = fetch_github_repo_data(repo_path)
            if not github_data:
                return Response({"error": "Could not find that repo on GitHub!"}, status=404)

            ai_text = generate_repo_insight(github_data)

            cached_analysis = RepoAnalysis.objects.create(
                repo_full_name=repo_path,
                ai_summary=ai_text,
                top_languages={"primary": github_data.get('language')}
            )
        else:
            # If the repository record does not exist for this guest, we still need GitHub data for defaults.
            if not Repository.objects.filter(guest_id=guest_id, full_name=repo_path).exists():
                github_data = fetch_github_repo_data(repo_path)
                if not github_data:
                    return Response({"error": "Could not find that repo on GitHub!"}, status=404)

        defaults = {
            'name': repo_path.split('/')[-1],
            'github_url': repo_url,
        }
        if github_data is not None:
            defaults['github_created_at'] = github_data.get('created_at')

        # We record that THIS specific guest looked at this repo
        repo_obj, _ = Repository.objects.get_or_create(
            guest_id=guest_id,
            full_name=repo_path,
            defaults=defaults
        )

        return Response({
            "repo_details": RepositorySerializer(repo_obj).data,
            "ai_analysis": cached_analysis.ai_summary
        })