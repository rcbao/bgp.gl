import json
import geocoder # Needs pip install geocoder --user

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

            physical_router_address = line_info[5]

            # Get location
            location = geocoder.ip(physical_router_address)
            if location.country == "US":
                lat_long_arr = location.latlng
                state = location.state
            
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
