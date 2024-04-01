import json
import sys
from utils.us_data_aggregator import USDataAggregator


def save_json(filename, data):
    with open(filename, "w") as json_file:
        json.dump(data, json_file, indent=4)


# Main function to run the script
def main(rib_file_path):

    us_aggregator = USDataAggregator()
    us_json = us_aggregator.get_results()

    # Write the JSON data to a file
    save_json("../us.json", us_json)

    print("Conversion completed. JSON data saved.")


if __name__ == "__main__":
    rib_file_path = sys.argv[1]
    main(rib_file_path)
