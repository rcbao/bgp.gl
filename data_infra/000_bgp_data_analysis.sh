#!/bin/bash

# Run the entire data pipeline to parse raw BGP data (*.rib)
# to final dashboard-ready data (us.json and states.json)

# Steps:
# 1. Get the raw BGP data using the 001_bgp_downloader.sh script
# 2. Parse the raw BGP data to a tabular format using the 002_bgp_parser.sh script
# 3. Analyze the tabular data to get the final data for the dashboard using rib_txt_to_json.py
# 4. Save output to the output directory
