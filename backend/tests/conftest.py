import pytest
from app import create_app
from extensions import db
from models.user import User

@pytest.fixture
def app():
    app = create_app()
    app.config.update({
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": "sqlite:///:memory:",
        "WTF_CSRF_ENABLED": False,
    })

    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()

@pytest.fixture
def auth_client(client, app):
    with app.app_context():
        user = User(username="testuser")
        user.set_password("securepassword123")
        db.session.add(user)
        db.session.commit()

    client.post("/login", json={
        "username": "testuser",
        "password": "securepassword123"
    })
    return client