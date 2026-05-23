import os
from flask import Flask
from flask_cors import CORS
from extensions import db, login_manager
from models.user import User

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'dev-secret-key-123')

    basedir = os.path.abspath(os.path.dirname(__file__))
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///' + os.path.join(basedir, 'applications.db')
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    app.config.update(
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE='Lax',
        SESSION_COOKIE_SECURE=False,
    )

    CORS(app, supports_credentials=True, resources={r"/*": {"origins": ["http://localhost:5173", "http://127.0.0.1:5173"]}})

    db.init_app(app)
    login_manager.init_app(app)

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(user_id)
    
    from routes.auth import auth_bp
    from routes.applications import apps_bp
    app.register_blueprint(auth_bp)
    app.register_blueprint(apps_bp)

    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    app.run(host='0.0.0.0', port=port)