import json
import heapq
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
            us_data = load_json("api/data/us-output-v2.json")

            return Response(us_data, status=status.HTTP_200_OK)

        except ValueError as ve:
            print(str(ve))
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return internal_server_error()


class StateDataView(APIView):
    """The API view for state-specific data"""

    def get(self, request, state_name, *args, **kwargs):
        try:
            all_states_data = load_json("api/data/state-output-v2.json")

            # Ensure state name exists in the data, and it's case-insensitive
            state_data = all_states_data.get(state_name)

            if state_data:
                return Response(state_data, status=status.HTTP_200_OK)
            else:
                return Response(
                    {"error": "State not found"}, status=status.HTTP_404_NOT_FOUND
                )

        except ValueError as ve:
            print(str(ve))
            return Response({"error": str(ve)}, status=status.HTTP_400_BAD_REQUEST)
        except Exception as e:
            print(e)
            return internal_server_error()
