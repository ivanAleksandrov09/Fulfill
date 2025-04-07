from django.contrib.auth.models import User
from rest_framework import serializers

# the serializer converts JSON to python code and vice versa
# User is a built in class


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {
            "password": {"write_only": True}
        }  # no one can read what the password is

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user
