from django.conf import settings
from django.conf.urls.static import static
from django.urls import path

from .views.PDFAnalyzer import PDFAnalyzerView
from .views.TextAnalyzer import TextAnalyzerView
from .views.views import UserInfoView

urlpatterns = [
    path("analyze-text/", TextAnalyzerView.as_view()),
    path("analyze-pdf/", PDFAnalyzerView.as_view()),
    path("user-info/", UserInfoView.as_view()),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
