import os
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
import uuid

app = Flask(__name__)

CORS(app, resources={r"/*": {"origins": "*"}})

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'applications.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

class Application(db.Model):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    company = db.Column(db.String(100), nullable=False)
    role = db.Column(db.String(100), nullable=False)
    status = db.Column(db.String(50), default='Applied')

    def to_dict(self):
        return {
            "id": self.id,
            "company": self.company,
            "role": self.role,
            "status": self.status
        }

with app.app_context():
    db.create_all()

@app.route('/applications', methods=['GET'])
def get_applications():
    apps = Application.query.all()
    return jsonify([app.to_dict() for app in apps])

@app.route('/applications', methods=['POST'])
def add_application():
    data = request.get_json()
    new_app = Application(
        company=data.get('company'),
        role=data.get('role'),
        status=data.get('status', 'Applied')
    )
    db.session.add(new_app)
    db.session.commit()
    return jsonify(new_app.to_dict()), 201

@app.route('/applications/<app_id>', methods=['PUT'])
def update_application(app_id):
    data = request.get_json()
    app_entry = Application.query.get(app_id)

    if not app_entry:
        return jsonify({"error": "Not found"}), 404
    
    app_entry.company = data.get('company', app_entry.company)
    app_entry.role = data.get('role', app_entry.role)
    app_entry.status = data.get('status', app_entry.status)

    db.session.commit()
    return jsonify(app_entry.to_dict()), 200

@app.route('/applications/<app_id>', methods=['DELETE'])
def delete_application(app_id):
    app_entry = Application.query.get(app_id)
    if app_entry:
        db.session.delete(app_entry)
        db.session.commit()
        return jsonify({"message": "Deleted"}), 200
    return jsonify({"error": "Not found"}), 404

if __name__ == '__main__':
    import os
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)