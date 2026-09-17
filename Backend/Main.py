##open this to test if api is working http://127.0.0.1:8003/docs
##To restart or enable API use- uvicorn Backend.Main:app --reload --port 8003
#imports
import json
from pathlib import Path
from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.staticfiles import StaticFiles

from Backend.database import (
    get_ip_addresses as fetch_ip_addresses,
    get_security_events,
    insert_security_event,
)


#initialize FastAPI app
app = FastAPI()

#mounting the frontend using staticfiles
frontend_path = Path(__file__).resolve().parent.parent / "Frontend"

class SecurityEventCreate(BaseModel):
    event_type: str
    severity: Literal["Critical", "High", "Medium", "Low"]
    source_ip: str
    event_status: Literal["Failed", "Breached", "Detected"] = "Detected"

#creating and loading a json file with security data
data_file_path = Path(__file__).parent / "data.json"
with data_file_path.open("r", encoding="utf-8") as f:
    data = json.load(f)

#endpoint to get security data from the json file and confirmed it works
@app.get("/security-data")
def get_security_data():
    return data

#endpoint to check the health of the API
@app.get("/api/health")
def health_check():
    return {"status": "ok"}

## getting alert data from the database and returning it as a JSON response
@app.get("/alerts")
def get_alerts():
    return get_security_events()


@app.post("/security-events")
def create_security_event(event: SecurityEventCreate):
    event_id = insert_security_event(
        event.event_type,
        event.severity,
        event.source_ip,
        event.event_status,
    )
    return {"id": event_id, "status": "created"}


@app.get("/IP-addresses")
def get_ip_addresses():
    return fetch_ip_addresses()


app.mount(
    "/",
    StaticFiles(directory=frontend_path, html=True),
    name="frontend",
)