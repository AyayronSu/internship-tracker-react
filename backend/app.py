import os
import logging
from logging.config import dictConfig
from flask import Flask
from flask_cors import CORS
from extensions import db, login_manager
from models.user import User

dictConfig({
    'version': 1,
    'formatters': {
        'default': {
            'format': '[%(asctime)s] %(levelname)s in %(module)s: %(message)s',        
        }
    },
    'handlers': {
        'console': {
            'class': 'logging.StreamHandler',
            'stream': 'ext://sys.stdout',
            'formatter': 'default'
        },
    },
    'root': {
        'level': 'INFO',
        'handlers': ['console']
    }
})

def create_app():
    app = Flask(__name__)

    app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY', 'local-development-fallback-key-123')

    raw_db_url = os.environ.get('DATABASE_URL', 'postgresql://localhost/applytrack')
    if raw_db_url.startswith("postgres://"):
        raw_db_url = raw_db_url.replace("postgres://", "postgresql://", 1)

    app.config['SQLALCHEMY_DATABASE_URI'] = raw_db_url
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    is_production = 'DATABASE_URL' in os.environ

    app.config.update(
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE='Lax' if not is_production else 'None',
        SESSION_COOKIE_SECURE=is_production,
    )

    allowed_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ]
    frontend_url = os.environ.get('FRONTEND_URL')
    if frontend_url:
        allowed_origins.append(frontend_url)

    CORS(
        app,
        supports_credentials=True,
        resources={r"/*": {"origins": allowed_origins}}
    )

    db.init_app(app)
    login_manager.init_app(app)

    login_manager.login_view = None

    @login_manager.user_loader
    def load_user(user_id):
        return User.query.get(str(user_id))
    
    from routes.auth import auth_bp
    from routes.applications import apps_bp
    from routes.errors import errors_bp

    app.register_blueprint(errors_bp)
    app.register_blueprint(auth_bp)
    app.register_blueprint(apps_bp)

    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    host_target = '0.0.0.0' if 'DATABASE_URL' in os.environ else 'localhost'
    app.run(host=host_target, port=port)