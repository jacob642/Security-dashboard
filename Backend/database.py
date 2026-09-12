import sqlite3
from pathlib import Path

DATABASE_PATH = Path(__file__).resolve().parent.parent / "Database" / "security.db"


def get_security_events():
    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            """
            SELECT security_events.id, security_events.event_type,
                   security_events.severity, ip_addresses.ip_address AS source_ip,
                   security_events.created_at
            FROM security_events
            LEFT JOIN ip_addresses ON ip_addresses.id = security_events.source_ip_id
            ORDER BY security_events.created_at DESC
            """
        ).fetchall()
        return [dict(row) for row in rows]


def get_ip_addresses():
    with sqlite3.connect(DATABASE_PATH) as connection:
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            "SELECT id, ip_address, attack_count FROM ip_addresses ORDER BY attack_count DESC"
        ).fetchall()
        return [dict(row) for row in rows]