import pandas as pd
from collections import defaultdict

MOCKING = False


class USDataAggregator:
    def __init__(self, rib_dataframe) -> None:
        self.df = rib_dataframe

    def get_overview_results(self):

        if MOCKING:
            return {
                "numberOfAnnouncements": 128000,
                "mostAdvertisedIpPrefixes": "127.0.0.1",
                "asWithMostRoutes": "Google Inc.",
                "mostCommonPrefixLength": 12,
            }

    def get_prefix_length_distribution(self):
        # TODO: Implement this method
        return [
            {"length": 12, "count": 1280},
            {"length": 18, "count": 1490},
        ]

    def get_us_heatmap_data(self):
        agg_columns = ["state", "latitude", "longitude"]
        aggregated = self.df.groupby(agg_columns).size().reset_index(name="count")

        # Transform the aggregated data into the desired JSON structure
        result = defaultdict(lambda: {"stateAnnouncementHeatMap": []})

        # Create the JSON structure without iterrows()
        for state, new_df in aggregated.groupby("state"):
            result[state]["stateAnnouncementHeatMap"] = [
                {"long": row.longitude, "lat": row.latitude, "count": int(row.count)}
                for row in new_df.itertuples()
            ]

        result = dict(result)
        print(result)
        return result

    def get_results(self):
        overview = self.get_overview_results()
        prefix_length_distribution = self.get_prefix_length_distribution()
        us_announcement_heatmap = self.get_us_heatmap_data()

        return {
            "overview": overview,
            "prefixLengthDistribution": prefix_length_distribution,
            "usAnnouncementHeatMap": us_announcement_heatmap,
        }
