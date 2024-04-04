from collections import defaultdict

MOCKING = False


class USDataAggregator:
    def __init__(self, rib_dataframe) -> None:
        self.df = rib_dataframe
        print(self.df.head())

    def get_overview_results(self):
        num_announcements = len(self.df)
        most_advertised_prefixes = self.df["prefix"].mode().iloc[0]
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

    def get_state_heatmap_data(self):
        """Get heatmap data for each individual state.

        Sample output:
        {
            'California': [{'long': -118.0871, 'lat': 34.0899, 'count': 27}],
            'Nebraska': [{'long': -96.1494, 'lat': 41.2854, 'count': 28}]
        }
        """
        agg_columns = ["state", "latitude", "longitude"]
        aggregated = self.df.groupby(agg_columns).size().reset_index(name="count")

        result = defaultdict(list)

        row_format = lambda row: {
            "long": row.longitude,
            "lat": row.latitude,
            "count": int(row.count),
        }

        for state, new_df in aggregated.groupby("state"):
            result[state] = [row_format(row) for row in new_df.itertuples()]

        result = dict(result)
        print(result)
        return result

    def get_results(self):
        overview = self.get_overview_results()
        prefix_length_distribution = self.get_prefix_length_distribution()
        us_announcement_heatmap = self.get_state_heatmap_data()

        result = {
            "overview": overview,
            "prefixLengthDistribution": prefix_length_distribution,
            "usAnnouncementHeatMap": us_announcement_heatmap,
        }
        print(result)
        return result
