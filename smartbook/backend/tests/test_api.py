"""
test_api.py - Integration Tests for Flask REST API Endpoints
Verifies books listing, filtering, recommendation pipeline, rules retrieval,
statistics, and authenticated admin CRUD operations.
"""

import sys
from pathlib import Path
import json

backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

import pytest
from app import app, ADMIN_TOKEN

@pytest.fixture
def client():
    """Create Flask test client fixture."""
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_api_list_books(client):
    """Verify /api/books returns book catalog with filtering."""
    res = client.get("/api/books")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "success"
    assert data["count"] >= 50
    assert len(data["books"]) >= 50

    # Test filtering by language
    res_hindi = client.get("/api/books?language=Hindi")
    data_hindi = res_hindi.get_json()
    assert all(b["language"] == "Hindi" for b in data_hindi["books"])

def test_api_get_book_details(client):
    """Verify /api/books/<id> returns book or 404."""
    # Get first book ID dynamically
    res_list = client.get("/api/books")
    books = res_list.get_json()["books"]
    assert len(books) > 0
    first_id = books[0]["id"]

    # Existing book
    res = client.get(f"/api/books/{first_id}")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "success"
    assert "title" in data["book"]

    # Non-existent book
    res_404 = client.get("/api/books/99999")
    assert res_404.status_code == 404

def test_api_recommend_endpoint(client):
    """Verify /api/recommend accepts preferences and returns top 5 with XAI trace."""
    payload = {
        "genre": "Self-Help",
        "mood": "Motivated",
        "reading_difficulty": "Beginner",
        "preferred_length": "Medium",
        "language": "English",
        "reading_purpose": "Personal Development"
    }
    res = client.post("/api/recommend", json=payload)
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "success"
    assert len(data["recommendations"]) <= 5
    assert len(data["recommendations"]) > 0
    assert "user_preferences" in data
    assert "matched_rules" in data

    # Verify score and explanation in recommendations
    top_book = data["recommendations"][0]
    assert "compatibility_score" in top_book
    assert "explanation" in top_book
    assert "matched_rule_ids" in top_book

def test_api_recommend_missing_fields(client):
    """Verify /api/recommend validates payload fields."""
    res = client.post("/api/recommend", json={"genre": "Fiction"})
    assert res.status_code == 400
    data = res.get_json()
    assert data["status"] == "error"

def test_api_rules_endpoint(client):
    """Verify /api/rules returns knowledge base."""
    res = client.get("/api/rules")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "success"
    assert data["total_rules"] >= 15
    assert all("rule_id" in r for r in data["rules"])

def test_api_stats_endpoint(client):
    """Verify /api/stats returns aggregated metrics."""
    res = client.get("/api/stats")
    assert res.status_code == 200
    data = res.get_json()
    assert data["status"] == "success"
    assert data["total_books"] >= 50
    assert "English" in data["language_distribution"]
    assert "Hindi" in data["language_distribution"]
    assert "Marathi" in data["language_distribution"]

def test_api_admin_auth_and_crud(client):
    """Verify admin login and authenticated CRUD lifecycle."""
    # 1. Invalid login
    res_bad = client.post("/api/admin/login", json={"username": "admin", "password": "wrongpassword"})
    assert res_bad.status_code == 401

    # 2. Valid login
    res_login = client.post("/api/admin/login", json={"username": "admin", "password": "smartbook123"})
    assert res_login.status_code == 200
    auth_data = res_login.get_json()
    token = auth_data["token"]

    headers = {"Authorization": f"Bearer {token}"}

    # 3. Create book without auth -> 401
    new_book = {
        "title": "Test AI Book",
        "author": "Dr. Alan Turing",
        "genre": "Technology",
        "description": "Foundations of artificial intelligence.",
        "language": "English",
        "pages": 250,
        "reading_difficulty": "Intermediate",
        "suitable_mood": "Curious",
        "reading_purpose": "Learning",
        "cover_image": "https://example.com/cover.jpg",
        "rating": 4.9
    }
    res_no_auth = client.post("/api/admin/books", json=new_book)
    assert res_no_auth.status_code == 401

    # 4. Create book with auth -> 201
    res_create = client.post("/api/admin/books", json=new_book, headers=headers)
    assert res_create.status_code == 201
    created_id = res_create.get_json()["book_id"]

    # 5. Update book
    update_data = {"title": "Test AI Book (Updated Edition)"}
    res_update = client.put(f"/api/admin/books/{created_id}", json=update_data, headers=headers)
    assert res_update.status_code == 200

    # 6. Delete book
    res_delete = client.delete(f"/api/admin/books/{created_id}", headers=headers)
    assert res_delete.status_code == 200
