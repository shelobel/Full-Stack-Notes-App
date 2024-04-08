from django.contrib.auth.models import User
from rest_framework import serializers
from .models import Note

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ["id", "username", "password"]
        extra_kwargs = {"password": {"write_only": True}}
        # means we want to accept the password (when user enters or writes)
        # but we dont wanna show the password with other details (to be "read")

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data) 
        # ** to split the args and kwargs and accepting data from dicionary as is
        return user
    

class NoteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Note
        fields = ["id", "title", "content", "created_at", "author"]
        extra_kwargs = {"author": {"read_only": True}}
        # we should be able to read who the author is but cant write or edit.
        # manually we set author of note as the user making note. cant manipulate

        
