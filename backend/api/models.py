from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class TextDocument(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    document_name = models.CharField(default="Empty")
    document_data = models.JSONField()

class PDFDocument(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    PDF = models.FileField(upload_to='documents/%Y/%m/%d')
    document_data = models.JSONField()
    document_name = models.CharField(default="Empty")
    saved_hash = models.CharField(default="NULL")