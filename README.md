# Security Dashboard

A lightweight security monitoring dashboard that combines a FastAPI backend, SQLite database, and a browser-based frontend to visualize security events, severity breakdowns, attack trends, and the most active source IPs.

This project is designed to simulate a basic SOC-style dashboard where suspicious activity is logged, aggregated, and displayed in real time through a single-page web interface.

## Overview

The application consists of:

- A FastAPI API that serves security data and accepts new event submissions
- A SQLite database for storing security events and IP activity
- A static frontend dashboard rendered in the browser
- Charts and summary cards for monitoring event severity and attack activity

The UI is served directly by the FastAPI application, so once the backend is running, the dashboard is available from the same local server.

## Features

- Real-time summary of security incidents by severity:
  - Critical
  - High
  - Medium
  - Low
- Dashboard cards for recent security events and alert priorities
- Event log feed with status labels such as Detected, Failed, and Breached
- Line chart showing attacks over the last 7 days
- Ranking of the most active attacking IP addresses
- SQLite-backed persistence for security event data
- REST API endpoint support for retrieving and posting security data
- Built-in health check and API documentation via FastAPI

## Tech Stack

- Python
- FastAPI
- SQLite
- HTML
- CSS
- JavaScript
- Chart.js

## Project Structure

```text
Security-dashboard/
├── Backend/
│   ├── Main.py
│   ├── database.py
│   ├── data.json
│   └── requirements.txt
├── Database/
│   └── database.sql
├── Frontend/
│   ├── index.html
│   ├── script.js
│   ├── style.css
│   └── tests/
│       └── tests.js
├── README.md
└── .venv/
```

## Prerequisites

Before running the project, make sure you have:

- Python 3.10 or newer
- pip
- A local terminal or command prompt

## Installation

1. Open a terminal in the project root.
2. Create and activate a virtual environment if you want an isolated environment:

```bash
python -m venv .venv
```

On Windows PowerShell:

```powershell
.\.venv\Scripts\Activate.ps1
```

On macOS/Linux:

```bash
source .venv/bin/activate
```

3. Install the required backend dependencies:

```bash
pip install -r Backend/requirements.txt
```

## Database Setup

The project uses SQLite and defines its schema in [Database/database.sql](Database/database.sql).

The application will automatically create and use the database at:

```text
Database/security.db
```

The backend also checks for schema compatibility at runtime and adds the event_status column if it is missing.

### Connecting from a custom Python script

The application already connects to SQLite through [Backend/database.py](Backend/database.py); you do not need a separate script to run the dashboard. To read events from your own Python code, create `connect_database.py` in the project root with the following contents:

```python
import sqlite3
from pathlib import Path

database_path = Path(__file__).resolve().parent / "Database" / "security.db"
if not database_path.exists():
  raise FileNotFoundError(f"Database not found: {database_path}")

with sqlite3.connect(database_path) as connection:
  connection.row_factory = sqlite3.Row
  events = connection.execute(
    """
    SELECT security_events.id, security_events.event_type,
         security_events.severity, ip_addresses.ip_address AS source_ip,
         security_events.created_at, security_events.event_status
    FROM security_events
    LEFT JOIN ip_addresses ON ip_addresses.id = security_events.source_ip_id
    ORDER BY security_events.created_at DESC
    """
  ).fetchall()

for event in events:
  print(dict(event))
```

Run it from the project root (or any directory) with:

```bash
python connect_database.py
```

## Running the Application

From the project root, start the FastAPI server:

```bash
uvicorn Backend.Main:app --reload --port 8003
```

Then open the app in your browser:

```text
http://127.0.0.1:8003/
```

FastAPI interactive docs are also available at:

```text
http://127.0.0.1:8003/docs
```

## API Endpoints

### Frontend/utility routes

- GET /
  - Serves the dashboard frontend
- GET /api/health
  - Returns the current API health status

### Security data

- GET /security-data
  - Returns the static JSON dataset from [Backend/data.json](Backend/data.json)

### Alerts and events

- GET /alerts
  - Returns all security events from the database, ordered by newest first
- POST /security-events
  - Creates a new security event
  - Body example:

```json
{
  "event_type": "Failed Login",
  "severity": "High",
  "source_ip": "192.168.1.42",
  "event_status": "Detected"
}
```

Accepted values:

- severity: Critical, High, Medium, Low
- event_status: Failed, Breached, Detected

### IP data

- GET /IP-addresses
  - Returns IP addresses with their attack counts, ordered by highest attack frequency

## Backend Behavior

The backend is implemented in [Backend/Main.py](Backend/Main.py), and it performs the following:

- Initializes the FastAPI application
- Mounts the frontend static files from [Frontend](Frontend)
- Loads initial JSON data from [Backend/data.json](Backend/data.json)
- Exposes API routes for application data and system health
- Saves new security events into SQLite using database helper functions

The database logic is handled in [Backend/database.py](Backend/database.py), which includes:

- inserting new events
- retrieving all events with IP names attached
- retrieving aggregated attack counts by IP address
- ensuring the database schema remains compatible

## Frontend Behavior

The frontend in [Frontend/index.html](Frontend/index.html) and [Frontend/script.js](Frontend/script.js) does the following:

- Fetches alert and IP data from the backend
- Displays severity totals in cards
- Builds a rotating alert summary for high-priority alerts
- Lists security events with timestamps and statuses
- Renders a weekly attack trend chart using Chart.js
- Displays the top attacking IP address list with ranked bars

## Data Model

The database stores two main tables:

### ip_addresses

- id: integer primary key
- ip_address: unique IP string
- attack_count: number of recorded attacks associated with that IP

### security_events

- id: integer primary key
- event_type: event name or type
- severity: Critical, High, Medium, Low
- source_ip_id: foreign key to ip_addresses
- created_at: timestamp when the event was recorded
- event_status: Failed, Breached, Detected

## Dashboard Usage

Once the app is running:

1. Open the frontend URL in your browser.
2. Review the Severity Summary panel.
3. Check the Alerts panel for prioritized incidents.
4. Inspect the Security Events list for the latest activity.
5. Monitor the attack trend chart for weekly changes.
6. Review the Top Attacking IPs panel to see the most active sources.

## Notes

- The project is intentionally simple and suitable for demo or learning purposes.
- The frontend is static and is served using FastAPI, meaning no separate frontend server is required.
- The database is local SQLite data and is stored in the project folder, so data persists between runs unless deleted manually.
- The application is a dashboard-style prototype and can be extended with authentication, real log ingestion, user roles, or more advanced analytics.

## Potential Extensions

Possible next improvements include:

- authentication and user access control
- export/import of security logs
- filtering by date, severity, and source IP
- live polling or WebSocket updates
- more detailed incident investigation pages
- integration with real threat intelligence feeds

## License

This project is shared as a local development example and does not currently include a formal license file.

## Quick Start

```bash
python -m venv .venv
.\.venv\Scripts\Activate.ps1
pip install -r Backend/requirements.txt
uvicorn Backend.Main:app --reload --port 8003
```

Then visit:

```text
http://127.0.0.1:8003/
```

And the API docs:

```text
http://127.0.0.1:8003/docs
```

