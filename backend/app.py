import os
import uuid
from flask import Flask, jsonify, request
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import UserMixin, LoginManager, login_user, logout_user, login_required, current_user
from werkzeug.security import generate_password_hash, check_password_hash

app = Flask(__name__)

app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-123')
app.config.update(
    SESSION_COOKIE_HTTPONLY=True,
    SESSION_COOKIE_SAMESITE='None',
    SESSION_COOKIE_SECURE=True,
)

CORS(app, supports_credentials=True, resources={r"/*": {"origins": "*"}})

login_manager = LoginManager()
login_manager.init_app(app)

basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'applications.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
db = SQLAlchemy(app)

class User(db.Model, UserMixin):
    id = db.Column(db.String(36), primary_key=True, default=lambda: str(uuid.uuid4()))
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120))

    applications = db.relationship('Application', backref='owner', lazy=True)

    def set_password(self, password):
        self.password_hash = generate_password_hash(password)

    def check_password(self, password):
        return check_password_hash(self.password_hash, password)
    
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

    user_id = db.Column(db.String(36), db.ForeignKey('user.id'), nullable=False)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(user_id)

with app.app_context():
    db.create_all()

@app.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    if User.query.filter_by(username=data.get('username')).first():
        return jsonify({"error": "User already exists"}), 400
    
    user = User(username=data.get('username'))
    user.set_password(data.get('password'))
    db.session.add(user)
    db.session.commit()
    return jsonify({"message": "User created"}), 201

@app.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()
    if user and user.check_password(data.get('password')):
        login_user(user, remember=True)
        return jsonify({"message": "Logged in", "user": user.username}), 200
    return jsonify({"error": "Invalid username or password"}), 401

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"}), 200

@app.route('/applications', methods=['GET'])
@login_required
def get_applications():
    user_apps = current_user.applications
    return jsonify([app.to_dict() for app in apps])

@app.route('/applications', methods=['POST'])
@login_required
def add_application():
    data = request.get_json()
    new_app = Application(
        company=data.get('company'),
        role=data.get('role'),
        status=data.get('status', 'Applied'),
        user_id=current_user.id
    )
    db.session.add(new_app)
    db.session.commit()
    return jsonify(new_app.to_dict()), 201

@app.route('/applications/<app_id>', methods=['PUT'])
@login_required
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
@login_required
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