import sys
import json
from mrtparse import Reader


class BGPAnalyzer:
    """
    This class is used to analyze BGP messages from a given file.
    Steps to analye BGP messages:
    (1) Filter
    """

    def __init__(self, file_path):
        self.file_path = file_path

    def get_bgp_messages(self):
        i = 0
        sys.stdout.write("[\n")
        for entry in Reader(self.file_path):
            sys.stdout.write(json.dumps([entry.data], indent=2)[2:-2])
            sys.stdout.write(", \n")
            i += 1
            if i > 200:
                break
        sys.stdout.write("]\n\n")


if __name__ == "__main__":
    file_path = "data/rib.20240321.2000"
    BGPAnalyzer(file_path).get_bgp_messages()
