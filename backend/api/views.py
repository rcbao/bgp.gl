import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status


def internal_server_error():
    error_response = {"error": "Internal Server Error"}
    error_code = status.HTTP_500_INTERNAL_SERVER_ERROR
    return Response(error_response, status=error_code)


def load_json(filename):
    with open(filename, "r") as json_file:
        return json.load(json_file)


def save_json(filename, data):
    with open(filename, "w") as json_file:
        json_file.write(data)


class USDataView(APIView):
    """The API view for the entire US data"""

    def get(self, request, *args, **kwargs):
        try:
            # Build the initial prompt using OpeningPromptBuilder
            us_data = load_json("api/data/us-output.json")

            return Response(us_data, status=status.HTTP_200_OK)

        except ValueError as ve:
            print(str(ve))
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return internal_server_error()
