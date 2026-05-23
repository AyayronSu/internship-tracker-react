import pytest
from extensions import db
from models.application import Application

def test_successful_registration(client):
    """Verify an entirely new user can register cleanly."""
    response = client.post("/register", json={
        "username": "newdeveloper",
        "password": "supersecurepassword"
    })
    assert response.status_code == 201
    assert response.get_json()["message"] == "User created"

def test_duplicate_user_registration_fails(client, app):
    """Verify system blocks registering a username that already exists."""
    with app.app_context():
        from models.user import User
        existing_user = User(username="clonedev")
        existing_user.set_password("pass123")
        db.session.add(existing_user)
        db.session.commit()

    response = client.post("/register", json={
        "username": "clondev",
        "password": "differentpass"
    })
    assert response.status_code == 400
    assert "already exists" in response.get_json()["error"]

def test_unauthenticated_dashboard_is_protected(client):
    """Ensure anonymous traffic is rejected with a 401 on data routes."""
    response = client.get("/applications")
    assert response.status_code == 401

def test_create_application(auth_client):
    """Verify logged-in user can successfully submit a new application card."""
    response = auth_client.post("/applications", json={
        "company": "Google",
        "role": "Product Manager",
        "status": "Applied"
    })
    assert response.status_code == 201

    data = response.get_json()
    assert data["company"] == "Google"
    assert data["role"] == "Product Manager"
    assert data["status"] == "Applied"
    assert "id" in data

def test_get_applications_list(auth_client):
    """Verify user can pull their current list of tracking records."""
    auth_client.post("/applications", json={
        "company": "Amazon",
        "role": "SDE Intern",
        "status": "Interviewing"
    })

    response = auth_client.get("/applications")
    assert response.status_code == 200

    data = response.get_json()
    assert isinstance(data, list)
    assert len(data) == 1
    assert data[0]["company"] == "Amazon"

def test_update_application_status(auth_client):
    """Verify an existing record can have its metadata or status altered."""
    create_res = auth_client.post("/applications", json={
        "company": "Apple",
        "role": "Hardware Engineer",
        "status": "Applied"
    })
    app_id = create_res.get_json()["id"]

    update_res = auth_client.put(f"/applications/{app_id}", json={
        "status": "Offer"
    })

    assert update_res.status_code == 200
    assert update_res.get_json()["status"] == "Offer"

def test_delete_application(auth_client):
    """Verify database drops an application row correctly on deletion"""
    create_res = auth_client.post("/applications", json={
        "company": "Tesla",
        "role": "Software Engineer",
        "status": "Rejected"
    })
    app_id = create_res.get_json()["id"]

    delete_res = auth_client.delete(f"/applications/{app_id}")
    assert delete_res.status_code == 200

    list_res = auth_client.get("/applications")
    assert len(list_res.get_json()) == 0