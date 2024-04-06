import ipaddress
import sqlite3
from .constants import IP_DATABASE
from functools import lru_cache


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
        result = self.cursor.fetchone()
        if not result:
            return (None, None, None)
        return result

    def close(self):
        self.conn.close()
