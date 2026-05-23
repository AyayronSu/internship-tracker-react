from extensions import db
from models.application import Application

class ApplicationService:
    @staticmethod
    def get_user_applications(user_id):
        return Application.query.filter_by(user_id=user_id).all()
    
    @staticmethod
    def add_application(user_id, company, role, status='Applied'):
        new_app = Application(
            company=company,
            role=role,
            status=status,
            user_id=user_id
        )
        db.session.add(new_app)
        db.session.commit()
        return new_app
    
    @staticmethod
    def update_application(user_id, app_id, data):
        app_entry = Application.query.filter_by(id=app_id, user_id=user_id).first()
        if not app_entry:
            return None
        
        app_entry.company = data.get('company', app_entry.company)
        app_entry.role = data.get('role', app_entry.role)
        app_entry.status = data.get('status', app_entry.status)

        db.session.commit()
        return app_entry
    
    @staticmethod
    def delete_application(user_id, app_id):
        app_entry = Application.query.filter_by(id=app_id, user_id=user_id).first()
        if app_entry:
            db.session.delete(app_entry)
            db.session.commit()
            return True
        return False