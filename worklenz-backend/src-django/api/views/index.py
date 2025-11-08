from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework import status


class IndexStatusView(APIView):
    http_method_names = ['get']

    def get(self, request):
        return Response(
            status = status.HTTP_200_OK,
            data = {
                "status": "200 OK",
                "request_type": "GET",
            }
        )
