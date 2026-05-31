from flask import Blueprint, request, jsonify, abort
from flask_login import login_required, current_user
from extensions import db
from models.application import Application
from services.app_service import ApplicationService

apps_bp = Blueprint('applications', __name__)

@apps_bp.route('/applications', methods=['GET'])
@login_required
def get_applications():
    page = request.args.get('page', 1, type=int)
    per_page = request.args.get('per_page', 10, type=int)
    sort_by = request.args.get('sort', 'newest', type=str)
    status_filter = request.args.get('status', 'All', type=str)
    
    query = Application.query.filter_by(user_id=current_user.id)

    if status_filter != 'All':
        query = query.filter_by(status=status_filter)

    if sort_by == 'oldest':
        query = query.order_by(Application.created_at.asc())
    else:
        query = query.order_by(Application.created_at.desc())

    paginated_data = query.paginate(page=page, per_page=per_page, error_out=False)

    return jsonify({
        "applications": [app.to_dict() for app in paginated_data.items],
        "pagination": {
            "current_page": paginated_data.page,
            "per_page": paginated_data.per_page,
            "total_pages": paginated_data.pages,
            "total_items": paginated_data.total,
            "has_next": paginated_data.has_next,
            "has_prev": paginated_data.has_prev
        }
    }), 200

@apps_bp.route('/applications', methods=['POST'])
@login_required
def add_application():
    data = request.get_json() or {}
    company = data.get('company')
    role = data.get('role')

    if not company or not role:
        abort(400, description="Missing required fields: company and role")

    new_app = ApplicationService.add_application(
        user_id=current_user.id,
        company=company,
        role=role,
        status=data.get('status', 'Applied')
    )
    return jsonify(new_app.to_dict()), 201

@apps_bp.route('/applications/<app_id>', methods=['PUT'])
@login_required
def update_application(app_id):
    data = request.get_json() or {}

    updated_app = ApplicationService.update_application(current_user.id, app_id, data)

    if not updated_app:
        abort(404, description=f"Application with ID {app_id} not found or access denied")

    return jsonify(updated_app.to_dict()), 200

@apps_bp.route('/applications/<app_id>', methods=['DELETE'])
@login_required
def delete_application(app_id):

    success = ApplicationService.delete_application(current_user.id, app_id)
    if not success:
        abort(404, description=f"Application with ID {app_id} not found or access denied")
    
    return jsonify({"message": "Deleted successfully"}), 200