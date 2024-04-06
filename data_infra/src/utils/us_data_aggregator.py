from collections import defaultdict
import json
import numpy as np
from .constants import US_GEOJSON_FILE
import dask.dataframe as dd
from dask.diagnostics import ProgressBar


def load_json(filename):
    with open(filename, "r") as json_file:
        return json.load(json_file)


def save_json(filename, data):
    with open(filename, "w") as json_file:
        json_file.write(data)


def get_us_state_names():
    us_json = load_json(US_GEOJSON_FILE)
    return [state["properties"]["name"] for state in us_json["features"]]


def convert_json(obj):
    if isinstance(obj, np.integer):
        return int(obj)
    raise TypeError


MOCKING = False


class USDataAggregator:
    def __init__(self, rib_dataframe) -> None:
        self.df = rib_dataframe
        print(self.df.head())

    def get_overview_results(self):
        num_announcements = len(self.df)
        most_advertised_prefixes = self.df["ip_prefix"].mode().iloc[0]
        as_with_most_routes = self.df["neighboring_AS"].mode().iloc[0]
        most_common_prefix_length = self.df["prefix_length"].mode().iloc[0]

        metrics = {
            "numberOfAnnouncements": num_announcements,
            "mostAdvertisedIpPrefixes": most_advertised_prefixes,
            "asWithMostRoutes": as_with_most_routes,
            "mostCommonPrefixLength": most_common_prefix_length,
        }
        return metrics

    def get_prefix_length_distribution(self):
        distribution = self.df.groupby("prefix_length").size().reset_index(name="count")

        format_func = lambda row: {
            "length": row.prefix_length,
            "count": row["count"],
        }

        distribution_list = [format_func(row) for _, row in distribution.iterrows()]
        return distribution_list

    def get_us_heapmap_data(self):
        states = get_us_state_names()
        announcements_per_state = {state: 0 for state in states}

        state_counts = self.df["state"].value_counts()

        for state, count in state_counts.items():
            if state in announcements_per_state:
                announcements_per_state[state] = count

        return announcements_per_state

    def get_state_overview_results(self):
        results = {}
        states = get_us_state_names()
        for state in states:
            # Filter DataFrame for the current state
            state_df = self.df[self.df["state"] == state]

            num_announcements = len(state_df)
            active_as = (
                state_df["neighboring_AS"].mode().iloc[0]
                if not state_df.empty
                else None
            )
            num_ases = state_df["neighboring_AS"].nunique()
            most_advertised_prefixes = (
                state_df["ip_prefix"].mode().iloc[0] if not state_df.empty else None
            )

            # Compute metrics
            results[state] = {
                "numberOfAnnouncements": num_announcements,
                "mostActiveLocalAS": active_as,
                "numberOfLocalASes": num_ases,
                "mostAdvertisedIpPrefixes": most_advertised_prefixes,
            }

        return results

    def get_state_prefix_length_distribution(self):
        results = {}
        states = get_us_state_names()
        # Move format_func outside the loop as it doesn't depend on the loop variable
        format_func = lambda row: {
            "length": row["prefix_length"],
            "count": row["count"],
        }

        for state in states:
            state_df = self.df[self.df["state"] == state]
            distribution = (
                state_df.groupby("prefix_length").size().reset_index(name="count")
            )

            # Use to_dict('records') for more efficient row iteration
            distribution_list = [
                format_func(row) for row in distribution.to_dict("records")
            ]
            results[state] = distribution_list

        return results

    def get_state_heatmap_data(self):
        """Get heatmap data for each individual state.

        Sample output:
        {
            'California': [{'long': -118.0871, 'lat': 34.0899, 'count': 27}],
            'Nebraska': [{'long': -96.1494, 'lat': 41.2854, 'count': 28}]
        }
        """
        ddf = dd.from_pandas(self.df, npartitions=24)

        # Perform the same aggregation operation in parallel
        agg_columns = ["state", "latitude", "longitude"]

        aggregated = ddf.groupby(agg_columns).size()
        aggregated = aggregated.rename("count").reset_index()

        with ProgressBar():
            result_df = aggregated.compute()

        # Format the result as needed (similar to the original implementation)
        result = defaultdict(list)
        row_format = lambda row: {
            "long": row.longitude,
            "lat": row.latitude,
            "count": int(row.count),
        }
        for state, new_df in result_df.groupby("state"):
            result[state] = [row_format(row) for row in new_df.itertuples()]

        return dict(result)

    def get_state_results(self):
        states = get_us_state_names()

        overviews = self.get_state_overview_results()
        distributions = self.get_state_prefix_length_distribution()
        heatmap_data = self.get_state_heatmap_data()

        final_results = {}
        for state in states:
            final_results[state] = {
                "overview": overviews.get(state, {}),
                "charts": {
                    "prefixLengthDistribution": distributions.get(state, []),
                    "stateAnnouncementHeatMap": heatmap_data.get(state, []),
                },
            }

        return json.dumps(final_results, indent=4, default=convert_json)

    def get_us_results(self):
        overview = self.get_overview_results()
        prefix_length_distribution = self.get_prefix_length_distribution()
        us_announcement_heatmap = self.get_us_heapmap_data()

        result = {
            "overview": overview,
            "prefixLengthDistribution": prefix_length_distribution,
            "usAnnouncementHeatMap": us_announcement_heatmap,
        }
        return json.dumps(result, indent=4, default=convert_json)

    def get_results(self):
        us_json = self.get_us_results()
        save_json("../us-output.json", us_json)

        state_json = self.get_state_results()
        save_json("../state-output.json", state_json)
        return us_json, state_json
