from django.urls import path
from .views.TextAnalyzer import TextAnalyzerView
from .views.PDFAnalyzer import PDFAnalyzerView
from .views.views import UserInfoView

urlpatterns = [
    path("analyze-text/", TextAnalyzerView.as_view()),
    path("analyze-pdf/", PDFAnalyzerView.as_view()),
    path("user-info/", UserInfoView.as_view()),
]
