#!/bin/bash

# Run the entire data pipeline to parse raw BGP data (*.rib)
# This slurm script invokes the 000_bgp_data_analysis.sh script to run the entire pipeline

### Time
## Greatest time for largemem is 96 hours.
#SBATCH --time=15:00:00


#SBATCH --nodes=1
#SBATCH --ntasks-per-node=1

#SBATCH -o gen.us-bgp.data.analysis.slurm.job.%j.out
#SBATCH -e gen.us-bgp.data.analysis.slurm.job.%j.err

#SBATCH --partition=bii

### Account.
#SBATCH -A nsf-crisp-2019

## . /etc/profile.d/modules.sh
## Rivanna.


./000_bgp_data_analysis.sh

echo " ------------------------------  "
echo " ------------------------------  "
echo " ------------------------------  "
echo " all done.  Pipeline completed."
echo " ------------------------------  "
echo " ------------------------------  "
echo " ------------------------------  "
echo " "


