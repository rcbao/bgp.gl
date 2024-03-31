import json
import requests
import pandas as pd
import reverse_geocoder as rg

# Function to fetch location data using CAIDA API
def get_coordinates(asn):
    url = f"https://api.asrank.caida.org/v2/restful/asns/{asn}"
    response = requests.get(url)
    if response.status_code == 200:
        data = response.json()
        longitude = data['data']['asn']['longitude']
        long = round(longitude, 3)
        latitude = data['data']['asn']['latitude']
        lat = round(latitude, 3)
        return lat, long 
    else:
        return None, None

# Use reverse_geocoder to get state based off of lat / long
def get_state_name(latitude, longitude):
    coordinates = (latitude, longitude)
    result = rg.search(coordinates)
    
    if result:
        state = result[0]['admin1'] # admin1 is state name
        return state
    else:
        return None

# Function to process the rib.txt file
def process_rib_file(rib_file_path):
    
    us_json = {}
    states_json = {}

    # Read the rib.txt file and process each line
    with open(rib_file_path, 'r') as rib_file:
        for line in rib_file:
            # Assume format is like HW2
            line = line.strip()
            line_info = line.split("|")

            prefix = line_info[5]
            peer_asn = line_info[4] 
            if len(line_info) >= 7:
                path = line_info[6]
                path = path.split(" ")
                asn = path[len(path) - 1]
            else: 
                asn = ''

    return us_json, states_json

# Main function to run the script
def main():
    rib_file_path = "rib.20240321.2000.tail.size.500.txt" # Change this to RIB txt file
    us_json, states_json = process_rib_file(rib_file_path)

    # Write the JSON data to a file
    with open("US_json_year.json", 'w') as json_file: # Change output file name
        json.dump(us_json, json_file, indent=4)
    with open("states_json_year.json", 'w') as json_file: # Change output file name
        json.dump(states_json, json_file, indent=4)

    print("Conversion completed. JSON data saved.")

if __name__ == "__main__":
    main()
