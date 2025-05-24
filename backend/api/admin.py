from django.contrib import admin
from .models import TextDocument, PDFDocument

# Register your models here.
admin.site.register(TextDocument)
admin.site.register(PDFDocument)