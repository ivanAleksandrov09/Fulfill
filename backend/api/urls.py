from django.urls import path
from .views.TextAnalyzer import TextAnalyzerView

urlpatterns = [
    path("analyze-text/", TextAnalyzerView.as_view()),
]
