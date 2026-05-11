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

    n = len(scores)
    mean = sum(scores) / n

    volume = min(n / 10.0, 1.0)

    if n > 1 and mean > 0:
        variance = sum((s - mean) ** 2 for s in scores) / n
        std_dev = variance ** 0.5
        cv = std_dev / mean
        consistency = max(1.0 - min(cv, 1.0), 0.0)
    else:
        consistency = 0.5

    confidence = (volume * 0.3 + consistency * 0.7) * 100
    return round(confidence, 2)

def format_ai_response(data, status="success"):
    return {
        "status": status,
        "timestamp": get_current_timestamp(),
        "data": data
    }
