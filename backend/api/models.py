from django.contrib.auth.models import User
from django.db import models


# Create your models here.
class TextDocument(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    documentData = models.JSONField()

class PDFDocument(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    PDF = models.FileField(upload_to='documents/%Y/%m/%d')
    documentData = models.JSONField()