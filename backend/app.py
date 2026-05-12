from flask import Flask, jsonify, request
from flask_cors import CORS
from storage import save_applications, load_applications, Application

app = Flask(__name__)


CORS(app, resources={r"/*": {"origins": "https://internship-tracker-react.vercel.app"}})

@app.route('/applications', methods=['GET'])
def get_applications():
    apps = load_applications()
    return jsonify([app.to_dict() for app in apps])

@app.route('/applications', methods=['POST'])
def add_application():
    data = request.get_json()
    new_app = Application(
        company=data.get('company'),
        role=data.get('role'),
        status=data.get('status')
    )
    current_apps = load_applications()
    current_apps.append(new_app)
    save_applications(current_apps)
    return jsonify(new_app.to_dict()), 201

@app.route('/applications/<app_id>', methods=['PUT', 'OPTIONS'])
def update_application(app_id):
    if request.method == 'OPTIONS':
        return jsonify({"msg": "ok"}), 200
    
    data = request.get_json()
    current_apps = load_applications()
    target_app = next((app for app in current_apps if app.id == app_id), None)

    if target_app:
        target_app.company = data.get('company', target_app.company)
        target_app.role = data.get('role', target_app.role)
        target_app.status = data.get('status', target_app.status)
        save_applications(current_apps)
        return jsonify({"message": "Updated"}), 200
    return jsonify({"error": "Not found"}), 404

@app.route('/applications/<app_id>', methods=['DELETE', 'OPTIONS'])
def delete_application(app_id):
    if request.method == 'OPTIONS':
        return jsonify({"msg": "ok"}), 200
    
    current_apps = load_applications()
    new_apps = [app for app in current_apps if app.id != app_id]

    if len(new_apps) < len(current_apps):
        save_applications(new_apps)
        return jsonify({"message": "Deleted"}), 200
    return jsonify({"error": "Not found"}), 404

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)