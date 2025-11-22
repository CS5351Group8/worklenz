from django.urls import path
from . import views

urlpatterns = [
    path("", views.index.IndexStatusView.as_view(), name = "API Connection Test Endpoint"),
    path("report/<str:filetype>", views.report.ReportView.as_view(), name = "Report Endpoint"),
]
