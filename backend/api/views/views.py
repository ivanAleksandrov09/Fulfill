from django.contrib.auth.models import User
from django.shortcuts import render
from rest_framework import generics, status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from ..serializers import UserSerializer

# Create your views here.


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()  # look at existing users to prevent doubling
    serializer_class = UserSerializer  # tells what kind of data we need to serialize
    permission_classes = [AllowAny]  # who we allow to create a user (everyone)

class UserInfoView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = str(request.user)

        return Response(user, status=status.HTTP_200_OK)

