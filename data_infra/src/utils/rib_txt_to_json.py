import json


# Function to process the rib.txt file
def process_rib_file(rib_file_path):

    us_json = {
        "overview": {},
        "charts": {"prefixLengthDistribution": [], "usAnnouncementHeatMap": {}},
    }
    states_json = {}

    # Read the rib.txt file and process each line
    with open(rib_file_path, "r") as rib_file:
        for line in rib_file:
            # Assume format is like HW2
            line = line.strip()
            line_info = line.split("|")

            physical_router = line_info[5]
            physical_router_arr = physical_router.split("/")
            physical_router_address = physical_router_arr[0]
            if len(physical_router_arr) >= 2:
                pr_prefix_length = physical_router_arr[1]
            else:
                pr_prefix_length = 0

            # Get location
            location = geocoder.ip(physical_router_address)
            if location.country == "US":
                # lat_long_arr = location.latlng
                latitude = location.lat
                longitude = location.lng
                state = location.state

                if state in states_json:
                    for item in states_json[state]["charts"][
                        "stateAnnouncementHeatMap"
                    ]:
                        if (
                            item.get("long") == longitude
                            and item.get("lat") == latitude
                        ):
                            # Update the "count" value for the found item
                            item["count"] = item.get("count", 0) + 1
                            break
                    else:
                        states_json[state]["charts"]["stateAnnouncementHeatMap"].append(
                            {"long": longitude, "lat": latitude, "count": 1}
                        )
                else:
                    states_json[state] = {
                        "overview": {},
                        "charts": {
                            "prefixLengthDistribution": [],
                            "stateAnnouncementHeatMap": [
                                {"long": longitude, "lat": latitude, "count": 1}
                            ],
                        },
                    }

                if state in us_json["charts"]["usAnnouncementHeatMap"]:
                    us_json["charts"]["usAnnouncementHeatMap"][state] += 1
                else:
                    us_json["charts"]["usAnnouncementHeatMap"][state] = 1

    return us_json, states_json


# Main function to run the script
def main():
    rib_file_path = "data/rib.20240321.2000.tail.size.500.txt"
    us_json, states_json = process_rib_file(rib_file_path)

    # Write the JSON data to a file
    with open("US_json_year.json", "w") as json_file:  # Change output file name
        json.dump(us_json, json_file, indent=4)
    with open("states_json_year.json", "w") as json_file:  # Change output file name
        json.dump(states_json, json_file, indent=4)

    print("Conversion completed. JSON data saved.")


if __name__ == "__main__":
    main()
