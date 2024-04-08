from django.shortcuts import render
from django.contrib.auth.models import User
from rest_framework import generics
from .serializers import UserSerializer, NoteSerializer
from rest_framework.permissions import IsAuthenticated, AllowAny
from .models import Note

# Create your views here.

class NoteListCreate(generics.ListCreateAPIView): 
    # listcreate view: list all notes that user created, OR create new view. 2 things
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]
    # this says u cannot call this root unless you are authenticated after passing a valid JWT token
    def get_queryset(self):
        user = self.request.user
        # purpose of this? so that we can get the USER of our note through the note..
        # and we can use that "user" to filter and display all notes of the particular user only 
        return Note.objects.filter(author = user)
    
    # when all data is serialized and captured for note from user input, we will now proceed to perform_create-
    #  verify once whether serialized data is ok or not, after checking MANUALLY add author of ntoe as the user making the note! and then create it :)
    def perform_create(self, serializer):
        if serializer.is_valid():
            serializer.save(author = self.request.user)
        else:
            print(serializer.errors)

class NoteDelete(generics.DestroyAPIView):
    serializer_class = NoteSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        return Note.objects.filter(author = user) 
    # only displays all the valid notes that u could delete(those that belong to u ofc) and after u specify which, it will automatically delete
    # if u are authenticated
 


class CreateUserView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

