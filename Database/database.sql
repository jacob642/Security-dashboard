PRAGMA foreign_keys = ON;
CREATE TABLE IF NOT EXISTS ip_addresses (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    ip_address TEXT NOT NULL UNIQUE,
    attack_count INTEGER NOT NULL DEFAULT 0 CHECK (attack_count >= 0)
);

CREATE TABLE IF NOT EXISTS security_events (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    event_type TEXT NOT NULL,
    severity TEXT NOT NULL CHECK (severity IN ('Critical', 'High', 'Medium', 'Low')),
    source_ip_id INTEGER,
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (source_ip_id) REFERENCES ip_addresses (id)
);

INSERT OR IGNORE INTO ip_addresses (ip_address, attack_count)
VALUES
    ('185.199.110.42', 428),
    ('198.51.100.24', 367),
    ('91.240.118.16', 291);

INSERT INTO security_events (event_type, severity, source_ip_id)
VALUES
    ('Brute-force login attempt', 'Critical', 1),
    ('Suspicious port scan', 'High', 2),
    ('Malware signature detected', 'High', 3);