import os
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from .components.map_data_connector import MapDataConnector


def internal_server_error():
    error_response = {"error": "Internal Server Error"}
    error_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    return Response(error_response, status=error_code)


class USDataView(APIView):
    """The API view for the entire US data"""

    def get(self, request, *args, **kwargs):
        try:
            # Build the initial prompt using OpeningPromptBuilder
            map_data = MapDataConnector().get_us_data()
            widget_data = {}
            us_data_response = {"map_data": map_data, "widget_data": widget_data}

            return Response(us_data_response, status=status.HTTP_200_OK)

        except ValueError as ve:
            print(str(ve))
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return internal_server_error()
