import json
import sys
import pandas as pd
from utils.us_data_aggregator import USDataAggregator


def save_json(filename, data):
    with open(filename, "w") as json_file:
        json.dump(data, json_file, indent=4)


# Main function to run the script
def main(bgp_dump_file):
    use_columns = [1, 4, 5, 6]
    column_names = ["timestamp", "neighboring_AS", "prefix", "AS_path"]

    df = pd.read_csv(
        bgp_dump_file,
        sep="|",
        header=None,
        usecols=use_columns,
        names=column_names,
    )

    # Format timestamp and AS_path columns
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit="s")
    df["AS_path"] = df["AS_path"].astype(str)

    print(df.head())

    us_aggregator = USDataAggregator(df)
    us_json = us_aggregator.get_results()

    # Write the JSON data to a file
    save_json("../us.json", us_json)

    print("Conversion completed. JSON data saved.")


if __name__ == "__main__":
    rib_file_path = sys.argv[1]
    main(rib_file_path)
