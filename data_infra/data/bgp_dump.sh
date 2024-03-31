#!/bin/bash

# Define the input RIB file and the output file
input_file="rib.20240321.2000"
output_file="${input_file}.txt"

# Check if bgpdump is installed
if ! command -v bgpdump &> /dev/null
then
    echo "bgpdump could not be found. Please install it."
    exit 1
fi

# Convert the RIB file to a more readable format
bgpdump -mO $output_file $input_file

# Notify the user
echo "Conversion completed. The output is saved to $output_file."
