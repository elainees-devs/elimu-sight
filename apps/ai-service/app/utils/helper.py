import uuid
import datetime
import json

def generate_uuid():
    return str(uuid.uuid4())

def get_current_timestamp():
    return datetime.datetime.utcnow().isoformat()

def safe_json_load(data):
    try:
        return json.loads(data)
    except:
        return {}
    
def calculate_confidence_score(scores):
    if len(scores) == 0:
        return 0.0
    total = 0

    for score in scores:
        total +=score

    return round(total / len(scores), 2)

def format_ai_response(data, status="success"):
    return {
        "status": "status",
        "timestamp": get_current_timestamp(),
        "data": data
    }
