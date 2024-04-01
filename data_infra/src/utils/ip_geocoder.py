import ipaddress
import csv


def load_ranges_from_csv(file_path):
    ranges = []
    with open(file_path, "r") as file:
        reader = csv.reader(file)
        for row in reader:
            start_ip, end_ip = int(row[0]), int(row[1])
            ranges.append((start_ip, end_ip))
    return ranges


def ip_in_range(ip_str, file_path):
    ip_int = int(ipaddress.ip_address(ip_str))
    ranges = load_ranges_from_csv(file_path)

    # Binary search, assuming ranges are sorted by the start address
    left, right = 0, len(ranges) - 1
    while left <= right:
        mid = (left + right) // 2
        if ranges[mid][0] <= ip_int <= ranges[mid][1]:
            return True
        elif ip_int < ranges[mid][0]:
            right = mid - 1
        else:
            left = mid + 1
    return False


# Example usage
file_path = "geolite2-city-ipv4-num-US-only.csv"
ip = "1.2.3.4"  # IP to check
print(ip_in_range(ip, file_path))
