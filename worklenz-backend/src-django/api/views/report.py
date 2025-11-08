from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.decorators import api_view
from rest_framework.views import APIView
from rest_framework import status
from rest_framework import serializers


class ReportView(APIView):
    http_method_names = ['post']

    def post(self, request, filetype):
        allowed_filetypes = ['pdf']
        if filetype not in allowed_filetypes:
            return Response(status = status.HTTP_400_BAD_REQUEST)
        return Response(status = status.HTTP_200_OK)
