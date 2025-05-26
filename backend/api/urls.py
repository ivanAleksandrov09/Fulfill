from django.urls import path

from .views.PDFAnalyzer import PDFAnalyzerView
from .views.SearchContent import SearchContentView
from .views.TextAnalyzer import TextAnalyzerView
from .views.views import UserInfoView

urlpatterns = [
    path("analyze-text/", TextAnalyzerView.as_view()),
    path("analyze-pdf/", PDFAnalyzerView.as_view()),
    path("user-info/", UserInfoView.as_view()),
    path("documents/search/", SearchContentView.as_view()),
]
