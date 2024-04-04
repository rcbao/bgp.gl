import pandas as pd
import numpy as np
from .ip_geocoder import IPGeocoder

MOCKING = False


def get_physical_router_addr(rib_line: str) -> tuple[str, int]:
    elements = rib_line.split("|")
    router_info = elements[5]

    addr_contains_prefix = "/" in router_info

    if addr_contains_prefix:
        (address, prefix_length) = router_info.split("/")
        res = (address, int(prefix_length))
        return res
    return (elements[5], None)


class USDataAggregator:
    def __init__(self, rib_dataframe) -> None:
        self.rib_df = rib_dataframe
        self.geocoder = IPGeocoder()

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
        def apply_lookup(row):
            lat, long, state = self.geocoder.lookup_ip_coordinates(row["prefix"])
            return pd.Series([lat, long, state])

        self.rib_df[["latitude", "longitude", "state"]] = self.rib_df.apply(
            apply_lookup, axis=1
        )
        value_counts = self.rib_df["state"].value_counts()
        print("Value counts for US states")
        print(value_counts)

    def get_results(self):
        overview = self.get_overview_results()
        prefix_length_distribution = self.get_prefix_length_distribution()
        us_announcement_heatmap = self.get_us_heatmap_data()

        self.geocoder.close()

        return {
            "overview": overview,
            "prefixLengthDistribution": prefix_length_distribution,
            "usAnnouncementHeatMap": us_announcement_heatmap,
        }
