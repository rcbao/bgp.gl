import json
import sys
import pandas as pd
from utils.us_data_aggregator import USDataAggregator
from utils.ip_geocoder import IPGeocoder

# import pretty print
import pprint


def load_json(filename):
    with open(filename, "r") as json_file:
        return json.load(json_file)


def save_json(filename, data):
    with open(filename, "w") as json_file:
        json_file.write(data)


def format_df(df):
    # Format timestamp and AS_path columns
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit="s")
    df[["prefix", "prefix_length"]] = df["prefix"].str.split("/", expand=True)

    df["AS_path"] = df["AS_path"].astype(str)
    df["prefix_length"] = df["prefix_length"].astype(int)


def geolocate_ip_df(df):
    geocoder = IPGeocoder()

    def lookup_func(row):
        lat, long, state = geocoder.lookup_ip_coordinates(row["prefix"])
        return pd.Series([lat, long, state])

    output_columns = ["latitude", "longitude", "state"]

    df[output_columns] = df.apply(lookup_func, axis=1)
    filtered_df = df.dropna(subset=output_columns)

    geocoder.close()
    return filtered_df


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

    format_df(df)
    df = geolocate_ip_df(df)

    us_aggregator = USDataAggregator(df)
    us_json, state_json = us_aggregator.get_results()

    # Write the JSON data to a file
    save_json("../us-output.json", us_json)
    save_json("../state-output.json", state_json)

    print("Conversion completed. JSON data saved.")


if __name__ == "__main__":
    rib_file_path = sys.argv[1]
    main(rib_file_path)
    # pprint.pprint(load_json("../state-output.json"))
