from .ip_geocoder import IPGeocoder


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
    def __init__(self) -> None:
        pass

    def get_overview_results(self):
        return {
            "numberOfAnnouncements": 128000,
            "mostAdvertisedIpPrefixes": "127.0.0.1",
            "asWithMostRoutes": "Google Inc.",
            "mostCommonPrefixLength": 12,
        }

    def get_prefix_length_distribution(self):
        return [
            {"length": 12, "count": 1280},
            {"length": 18, "count": 1490},
        ]

    def get_us_heatmap_data(self):
        return {"AL": 1200, "AK": 800, "AZ": 1800}

    def get_results(self):
        res = {}

        res["overview"] = self.get_overview_results()
        res["prefixLengthDistribution"] = self.get_prefix_length_distribution()
        res["usAnnouncementHeatMap"] = self.get_us_heatmap_data()

        return res
