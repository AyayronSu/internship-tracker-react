from flask import Blueprint, request, jsonify
from flask_login import login_required, current_user
from services.app_service import ApplicationService

apps_bp = Blueprint('applications', __name__)

@apps_bp.route('/applications', methods=['GET'])
@login_required
def get_applications():
    user_apps = ApplicationService.get_user_applications(current_user.id)
    return jsonify([app.to_dict() for app in user_apps]), 200

@apps_bp.route('/applications', methods=['POST'])
@login_required
def add_application():
    data = request.get_json() or {}
    if not data.get('company') or not data.get('role'):
        return jsonify({"error": "Missing company or role fields"}), 400
    
    new_app = ApplicationService.add_application(
        user_id=current_user.id,
        company=data.get('company'),
        role=data.get('role'),
        status=data.get('status', 'Applied')
    )
    return jsonify(new_app.to_dict()), 201

@apps_bp.route('/applications/<int:app_id>', methods=['PUT'])
@login_required
def update_application(app_id):
    data = request.get_json() or {}
    updated_app = ApplicationService.update_application(current_user.id, app_id, data)
    if not updated_app:
        return jsonify({"error": "Application not found"}), 404
    return jsonify(updated_app.to_dict()), 200

@apps_bp.route('/applications/<int:app_id>', methods=['DELETE'])
@login_required
def delete_application(app_id):
    success = ApplicationService.delete_application(current_user.id, app_id)
    if not success:
        return jsonify({"error": "Application not found"}), 404
    return jsonify({"message": "Deleted"}), 200

