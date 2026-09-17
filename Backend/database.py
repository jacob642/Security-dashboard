import sqlite3
from pathlib import Path

DATABASE_PATH = Path(__file__).resolve().parent.parent / "Database" / "security.db"


def _ensure_event_status_column(connection):
    columns = connection.execute("PRAGMA table_info(security_events)").fetchall()
    if not any(column[1] == "event_status" for column in columns):
        connection.execute(
            "ALTER TABLE security_events ADD COLUMN event_status TEXT NOT NULL DEFAULT 'Detected'"
        )


def insert_security_event(event_type, severity, source_ip, event_status):
    with sqlite3.connect(DATABASE_PATH) as connection:
        _ensure_event_status_column(connection)
        connection.execute(
            "INSERT OR IGNORE INTO ip_addresses (ip_address) VALUES (?)",
            (source_ip,)
        )
        ip_row = connection.execute(
            "SELECT id FROM ip_addresses WHERE ip_address = ?",
            (source_ip,)
        ).fetchone()
        cursor = connection.execute(
            """
            INSERT INTO security_events (event_type, severity, source_ip_id, event_status)
            VALUES (?, ?, ?, ?)
            """,
            (event_type, severity, ip_row[0], event_status)
        )
        return cursor.lastrowid


def get_security_events():
    with sqlite3.connect(DATABASE_PATH) as connection:
        _ensure_event_status_column(connection)
        connection.row_factory = sqlite3.Row
        rows = connection.execute(
            """
            SELECT security_events.id, security_events.event_type,
                   security_events.severity, ip_addresses.ip_address AS source_ip,
                   security_events.created_at, security_events.event_status
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
            """
            SELECT ip_addresses.id,
                   ip_addresses.ip_address,
                   COUNT(security_events.id) AS attack_count
            FROM ip_addresses
            LEFT JOIN security_events
                ON security_events.source_ip_id = ip_addresses.id
            GROUP BY ip_addresses.id, ip_addresses.ip_address
            ORDER BY attack_count DESC
            """
        ).fetchall()
        return [dict(row) for row in rows]