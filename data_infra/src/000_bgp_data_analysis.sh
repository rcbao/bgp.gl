#!/bin/bash

# Run the entire data pipeline to parse raw BGP data (*.rib)
# to final dashboard-ready data (us.json and states.json)

# Steps:
# 1. Get the raw BGP data using the bgp_downloader.sh script
# 2. Parse the raw BGP data to a tabular format using the bgp_parser.sh script
# 3. Analyze the tabular data to get the final data for the dashboard using rib_txt_to_json.py
# 4. Save output to the output directory

bgp_file_url="http://archive.routeviews.org/bgpdata/2024.03/RIBS/rib.20240321.2000.bz2"
output_dir="data"

# the BGP path derived from the URL. (Example: data/rib.20240321.2000)
bgp_filepath=$output_dir/$(echo $bgp_file_url | awk -F'/' '{print $NF}' | sed 's/\.bz2$//')

# download and parse BGP data
./bgp_downloader.sh $bgp_file_url $output_dir
./bgp_parser.sh $bgp_filepath

# analyze and convert tabular data to JSON
python3 rib_txt_to_json.py $output_dir