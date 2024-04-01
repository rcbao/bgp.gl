import ipaddress
import sqlite3


class IPGeocoder:
    def __init__(self, db_file):
        self.conn = sqlite3.connect(db_file)
        self.cursor = self.conn.cursor()

    def lookup_ip_coordinates(self, ip_str):
        ip_int = int(ipaddress.ip_address(ip_str))
        self.cursor.execute(
            """SELECT latitude, longitude FROM ip_ranges
               WHERE start_ip <= ? AND end_ip >= ?""",
            (ip_int, ip_int),
        )
        result = self.cursor.fetchone()
        return result  # Returns a tuple (latitude, longitude) or None

    def close(self):
        self.conn.close()
