from django.urls import path
from . import views

urlpatterns = [
    path("", views.index.IndexStatusView.as_view(), name = "API Connection Test Endpoint"),
]