import ipaddress
import sqlite3
from .constants import IP_DATABASE
from functools import lru_cache


class IPGeocoder:
    def __init__(self, db_file=IP_DATABASE):
        self.conn = sqlite3.connect(":memory:")
        self.cursor = self.conn.cursor()

        # Attach the external database file under alias 'disk_db'
        self.cursor.execute(f"ATTACH DATABASE ? AS disk_db", (db_file,))

        # Copy the 'ip_ranges' table from the external database to in-memory database
        self.cursor.execute("CREATE TABLE ip_ranges AS SELECT * FROM disk_db.ip_ranges")

        # The above line had a logical issue in previous assistance. It should be a single SQL statement without needing another execute call to detach immediately.

        # Now, it is safe to detach the external 'disk_db'
        self.cursor.execute("DETACH DATABASE disk_db")

        # Ensure the 'ip_ranges' table is indexed after confirming its existence
        self.cursor.execute(
            "CREATE INDEX IF NOT EXISTS idx_ip_ranges ON ip_ranges(start_ip, end_ip)"
        )

    @lru_cache(maxsize=1024)
    def lookup_ip_coordinates(self, ip_str):
        ip_int = int(ipaddress.ip_address(ip_str))
        self.cursor.execute(
            """SELECT latitude, longitude, state1 FROM ip_ranges
               WHERE start_ip <= ? AND end_ip >= ?""",
            (ip_int, ip_int),
        )
        result = self.cursor.fetchone()
        if not result:
            return (None, None, None)
        print(result)
        return result

    def close(self):
        self.conn.close()
