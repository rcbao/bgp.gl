
# Download BGP data from RouteViews
# The data is in the form of *.bz2 files
# Link format: http://archive.routeviews.org/bgpdata/2024.03/RIBS/rib.rib.20240321.2000.bz2

# Parameters

bgp_file_url=$1
output_dir=$2

output_filename=$(echo $bgp_file_url | awk -F'/' '{print $NF}')
output_filepath=${output_dir}/${output_filename}

wget $bgp_file_url -O $output_filepath

bunzip2 $output_filepath