from django.shortcuts import render
from .models import Repository  
from .serializers import RepositorySerializer
from rest_framework import viewsets

# Create your views here.

class RepositoryViewSet(viewsets.ModelViewSet):
    queryset = Repository.objects.all()
    serializer_class = RepositorySerializer

