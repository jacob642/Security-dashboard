##open this to test if api is working http://127.0.0.1:8003/docs

#imports
import json
from pathlib import Path
from fastapi import FastAPI


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