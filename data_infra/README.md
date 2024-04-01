# README

Input file: `https://cdn.jsdelivr.net/npm/@ip-location-db/geolite2-city-7z/geolite2-city-ipv4-num.csv.7z`

To get the sorted, US-only IP range lists, use the following shell command:

```bash
grep "US" geolite2-city-ipv4-num.csv > geolite2-city-ipv4-num-US-only.csv && sort -t, -k1,1n geolite2-city-ipv4-num-US-only.csv -o geolite2-city-ipv4-num-US-only.csv
```
