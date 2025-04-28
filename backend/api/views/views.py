from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from ..serializers import UserSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny

# Create your views here.


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()  # look at existing users to prevent doubling
    serializer_class = UserSerializer  # tells what kind of data we need to serialize
    permission_classes = [AllowAny]  # who we allow to create a user (everyone)
