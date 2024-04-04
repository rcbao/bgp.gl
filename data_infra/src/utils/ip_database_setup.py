import csv
import sqlite3

from constants import IP_DATABASE_CSV, IP_DATABASE


def create_and_populate_db(csv_file, db_file):
    conn = sqlite3.connect(db_file)
    c = conn.cursor()
    # Create table
    c.execute(
        """CREATE TABLE IF NOT EXISTS ip_ranges
                 (start_ip INTEGER, end_ip INTEGER, country_code TEXT, state1 TEXT, 
                 state2 TEXT, city TEXT, postcode TEXT, latitude REAL, longitude REAL, timezone TEXT)"""
    )
    # Index on start_ip and end_ip for faster queries
    c.execute("CREATE INDEX IF NOT EXISTS idx_start_ip ON ip_ranges (start_ip)")
    c.execute("CREATE INDEX IF NOT EXISTS idx_end_ip ON ip_ranges (end_ip)")

    seen = set()

    # Insert CSV data into the table
    with open(csv_file, "r") as file:
        reader = csv.reader(file)
        for row in reader:
            location_info_present = row[3] and row[7] and row[8]
            if location_info_present:
                # Round latitude and longitude to 3 decimal places
                lat, lon = round(float(row[7]), 4), round(float(row[8]), 4)
                state1 = row[3]
                if (state1, lat, lon) not in seen:
                    seen.add((state1, lat, lon))
                    row[7], row[8] = lat, lon
                    c.execute(
                        "INSERT INTO ip_ranges VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
                        row,
                    )

    conn.commit()
    conn.close()


if __name__ == "__main__":
    create_and_populate_db(IP_DATABASE_CSV, IP_DATABASE)
