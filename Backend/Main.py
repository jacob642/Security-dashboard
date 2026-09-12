##open this to test if api is working http://127.0.0.1:8003/docs

#imports
import json
from pathlib import Path
from fastapi import FastAPI

from Backend.database import get_ip_addresses as fetch_ip_addresses, get_security_events


#initialize FastAPI app
app = FastAPI()

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


@app.get("/IP-addresses")
def get_ip_addresses():
    return fetch_ip_addresses()