import ipaddress
import sqlite3
from .constants import IP_DATABASE


class IPGeocoder:
    def __init__(self, db_file=IP_DATABASE):
        self.conn = sqlite3.connect(db_file)
        self.cursor = self.conn.cursor()

    def lookup_ip_coordinates(self, ip_str):
        ip_int = int(ipaddress.ip_address(ip_str))
        self.cursor.execute(
            """SELECT latitude, longitude, state1 FROM ip_ranges
               WHERE start_ip <= ? AND end_ip >= ?""",
            (ip_int, ip_int),
        )

        # Returns a tuple (latitude, longitude) or None
        result = self.cursor.fetchone()
        if not result:
            return (None, None, None)
        print(result)
        return result

    def close(self):
        self.conn.close()
