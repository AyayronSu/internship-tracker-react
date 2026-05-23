from flask import Blueprint, request, jsonify, abort
from flask_login import login_user, logout_user, login_required, current_user
from services.auth_service import AuthService

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/check-auth', methods=['GET'])
def check_auth():
    if current_user.is_authenticated:
        return jsonify({"is_logged_in": True, "user": current_user.username}), 200

    abort(401, description="User is not authenticated")

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        abort(400, description="Username and password are required")
    
    user, error = AuthService.create_user(username, password)
    if error:
        abort(400, description=error)

    return jsonify({"message": "User created"}), 201
    
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json() or {}
    username = data.get('username')
    password = data.get('password')

    if not username or not password:
        abort(400, description="Username and password are required")

    user = AuthService.get_user_by_username(username)

    if not user or not user.check_password(password):
        abort(401, description="Invalid username or password")

    login_user(user, remember=True)
    return jsonify({"message": "Logged in", "user": user.username}), 200

@auth_bp.route('/logout', methods=['GET'])
@login_required
def logout():
    logout_user()
    return jsonify({"message": "Logged out"}), 200