from django.urls import path
from ..views.session import CreateSessionAPIView


urlpatterns = [
    path('create-session', CreateSessionAPIView.as_view(), name='create-session'),
]