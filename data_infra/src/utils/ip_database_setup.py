import csv
import sqlite3


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

    # Insert CSV data into the table
    with open(csv_file, "r") as file:
        reader = csv.reader(file)
        for row in reader:
            c.execute(
                "INSERT INTO ip_ranges VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", row
            )

    conn.commit()
    conn.close()
