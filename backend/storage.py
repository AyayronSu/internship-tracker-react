import os
import json
import uuid

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FILE_PATH = os.path.join(BASE_DIR, "data.json")

class Application:
    def __init__(self, company, role, status, id=None):
        self.id = id if id else str(uuid.uuid4())[:8]
        self.company = company
        self.role = role
        self.status = status
        
    def to_dict(self):
        return {
            "id": self.id,
            "company": self.company,
            "role": self.role,
            "status": self.status
        }
    
def save_applications(app_list):
    with open(FILE_PATH, "w") as file:
        json_ready_data = [app.to_dict() for app in app_list]
        json.dump(json_ready_data, file, indent=4)

def load_applications():
    try:
        with open(FILE_PATH, "r") as file:
            data = json.load(file)
            return [Application(d['company'], d['role'], d['status'], d.get('id')) for d in data]
    except (FileNotFoundError, json.JSONDecodeError):
        return []