from extensions import db
from models.user import User

class AuthService:
    @staticmethod
    def get_user_by_username(username):
        return User.query.filter_by(username=username).first()
    
    @staticmethod
    def create_user(username, password):
        if AuthService.get_user_by_username(username):
            return None, "User already exists"
        
        user = User(username=username)
        user.set_password(password)
        db.session.add(user)
        db.session.commit()
        return user, None