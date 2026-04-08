from django.shortcuts import render
from rest_framework import viewsets
from .models import Insight
from .serializers import InsightSerializer

# Create your views here.


class InsightViewSet(viewsets.ModelViewSet):
    queryset = Insight.objects.all()
    serializer_class = InsightSerializer 