#!/bin/bash

# parse BGP to a tabular format
# Usage: ./bgp_parser.sh <input_file_path>

# input file: a RIB file in MRT format (e.g., rib.20240321.2000)
input_file_path="$1"

input_dir=$(dirname "$input_file_path")
input_file=$(basename "$input_file_path")

output_file_path="${input_dir}/${input_file}.txt"

# Check if bgpdump is installed
if ! command -v bgpdump &> /dev/null
then
    echo "bgpdump could not be found. Please install it."
    exit 1
fi

# Convert the RIB file to a more readable format
bgpdump -mO "$output_file_path" "$input_file_path"

# Notify the user
echo "Conversion completed. The output is saved to $output_file_path."
