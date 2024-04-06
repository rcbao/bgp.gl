import json
import sys
import pandas as pd
from utils.us_data_aggregator import USDataAggregator
from utils.ip_geocoder import IPGeocoder


def load_json(filename):
    with open(filename, "r") as json_file:
        return json.load(json_file)


def format_df(df):
    df["timestamp"] = pd.to_datetime(df["timestamp"], unit="s")
    prefix_df = (
        df["prefix"]
        .str.split("/", expand=True)
        .rename(columns={0: "ip_prefix", 1: "prefix_length"})
    )
    # Drop the original 'prefix' column to avoid duplication
    df.drop("prefix", axis=1, inplace=True)
    df = pd.concat([df, prefix_df], axis=1)
    df["AS_path"] = df["AS_path"].astype(str)
    df["prefix_length"] = df["prefix_length"].astype(int)
    return df


def geolocate_ip_df(df):
    geocoder = IPGeocoder()

    # Pre-compute all unique IPs to minimize lookups
    unique_ips = df["ip_prefix"].unique()
    ip_locations = {ip: geocoder.lookup_ip_coordinates(ip) for ip in unique_ips}

    # Map the locations back to the DataFrame
    df["latitude"] = df["ip_prefix"].map(lambda x: ip_locations[x][0])
    df["longitude"] = df["ip_prefix"].map(lambda x: ip_locations[x][1])
    df["state"] = df["ip_prefix"].map(lambda x: ip_locations[x][2])

    filtered_df = df.dropna(subset=["latitude", "longitude", "state"])
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

    df = format_df(df)
    df = geolocate_ip_df(df)

    us_aggregator = USDataAggregator(df)
    us_json, state_json = us_aggregator.get_results()
    print(us_json)
    print(state_json)

    print("Conversion completed. JSON data saved.")


if __name__ == "__main__":
    rib_file_path = sys.argv[1]
    main(rib_file_path)
