"""
app.py - Flask REST API for SmartBook Recommendation System
Serves public catalog queries, rule-based recommendation pipeline,
system metrics, and authenticated admin CRUD endpoints.
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
import sqlite3
import os

from database import (
    get_all_books,
    get_book_by_id,
    add_book,
    update_book,
    delete_book,
    verify_admin,
    get_db_connection
)
from rules import get_all_rules, get_rule_by_id
from recommendation_engine import get_recommendations

app = Flask(__name__)
# Enable CORS for development and cross-origin frontend communication
CORS(app, resources={r"/api/*": {"origins": "*"}})

ADMIN_TOKEN = "smartbook-admin-authenticated-token-2026"

def check_admin_auth():
    """Verify admin bearer token or custom header."""
    auth_header = request.headers.get("Authorization", "")
    if auth_header.startswith("Bearer "):
        token = auth_header.split(" ")[1]
        return token == ADMIN_TOKEN
    return request.headers.get("X-Admin-Token") == ADMIN_TOKEN

# ========================================================
# 1. CATALOG ENDPOINTS
# ========================================================

@app.route("/api/books", methods=["GET"])
def list_books():
    """Retrieve all books with optional filtering by genre, language, difficulty, or search term."""
    genre = request.args.get("genre")
    language = request.args.get("language")
    difficulty = request.args.get("difficulty")
    search = request.args.get("search")

    books = get_all_books(
        genre=genre,
        language=language,
        difficulty=difficulty,
        search=search
    )
    return jsonify({
        "status": "success",
        "count": len(books),
        "books": books
    }), 200

@app.route("/api/books/<int:book_id>", methods=["GET"])
def get_book_details(book_id):
    """Retrieve complete metadata for a single book by ID."""
    book = get_book_by_id(book_id)
    if not book:
        return jsonify({
            "status": "error",
            "message": f"Book with ID {book_id} not found."
        }), 404
    return jsonify({
        "status": "success",
        "book": book
    }), 200

# ========================================================
# 2. RULE-BASED RECOMMENDATION ENDPOINT
# ========================================================

@app.route("/api/recommend", methods=["POST"])
def recommend_books():
    """
    Core AI Recommendation Endpoint.
    Accepts user preferences, applies forward chaining inference,
    calculates compatibility scores, and returns top 5 recommendations with XAI explanation trace.
    """
    data = request.get_json()
    if not data:
        return jsonify({
            "status": "error",
            "message": "Invalid request. JSON payload required."
        }), 400

    # Validate required preference fields
    required_fields = ["genre", "mood", "language"]
    missing = [f for f in required_fields if not data.get(f)]
    if missing:
        return jsonify({
            "status": "error",
            "message": f"Missing required preference fields: {', '.join(missing)}"
        }), 400

    limit = int(data.get("limit", 5))
    results = get_recommendations(data, limit=limit)
    return jsonify(results), 200

# ========================================================
# 3. KNOWLEDGE BASE & RULES ENDPOINT
# ========================================================

@app.route("/api/rules", methods=["GET"])
def list_rules():
    """Return all expert rules currently active in the knowledge base."""
    rules = get_all_rules()
    return jsonify({
        "status": "success",
        "total_rules": len(rules),
        "rules": rules
    }), 200

# ========================================================
# 4. SYSTEM STATISTICS ENDPOINT
# ========================================================

@app.route("/api/stats", methods=["GET"])
def get_system_stats():
    """Aggregate statistics for the dashboard: counts, language breakdown, genre breakdown."""
    conn = get_db_connection()
    cursor = conn.cursor()

    cursor.execute("SELECT COUNT(*) FROM books")
    total_books = cursor.fetchone()[0]

    cursor.execute("SELECT language, COUNT(*) FROM books GROUP BY language")
    lang_dist = {row[0]: row[1] for row in cursor.fetchall()}

    cursor.execute("SELECT genre, COUNT(*) FROM books GROUP BY genre")
    genre_dist = {row[0]: row[1] for row in cursor.fetchall()}

    cursor.execute("SELECT reading_difficulty, COUNT(*) FROM books GROUP BY reading_difficulty")
    difficulty_dist = {row[0]: row[1] for row in cursor.fetchall()}

    conn.close()

    return jsonify({
        "status": "success",
        "total_books": total_books,
        "total_rules": len(get_all_rules()),
        "language_distribution": lang_dist,
        "genre_distribution": genre_dist,
        "difficulty_distribution": difficulty_dist
    }), 200

# ========================================================
# 5. ADMIN AUTHENTICATION & CRUD ENDPOINTS
# ========================================================

@app.route("/api/admin/login", methods=["POST"])
def admin_login():
    """Authenticate administrator credentials."""
    data = request.get_json() or {}
    username = data.get("username", "").strip()
    password = data.get("password", "").strip()

    if not username or not password:
        return jsonify({
            "status": "error",
            "message": "Username and password are required."
        }), 400

    if verify_admin(username, password):
        return jsonify({
            "status": "success",
            "message": "Authentication successful.",
            "token": ADMIN_TOKEN,
            "username": username
        }), 200
    else:
        return jsonify({
            "status": "error",
            "message": "Invalid admin username or password."
        }), 401

@app.route("/api/admin/books", methods=["POST"])
def admin_add_book():
    """Add a new book to the database (Admin only)."""
    if not check_admin_auth():
        return jsonify({"status": "error", "message": "Unauthorized"}), 401

    data = request.get_json() or {}
    required = ["title", "author", "genre", "description", "language", "pages", "reading_difficulty", "suitable_mood", "reading_purpose", "cover_image"]
    missing = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({
            "status": "error",
            "message": f"Missing required fields: {', '.join(missing)}"
        }), 400

    new_id = add_book(data)
    return jsonify({
        "status": "success",
        "message": f"Book '{data['title']}' created successfully.",
        "book_id": new_id
    }), 201

@app.route("/api/admin/books/<int:book_id>", methods=["PUT"])
def admin_update_book(book_id):
    """Update an existing book's details (Admin only)."""
    if not check_admin_auth():
        return jsonify({"status": "error", "message": "Unauthorized"}), 401

    data = request.get_json() or {}
    existing = get_book_by_id(book_id)
    if not existing:
        return jsonify({"status": "error", "message": f"Book ID {book_id} not found."}), 404

    # Merge with existing values for any unprovided fields
    for key, val in existing.items():
        if key not in data:
            data[key] = val

    updated = update_book(book_id, data)
    if updated:
        return jsonify({
            "status": "success",
            "message": f"Book ID {book_id} updated successfully."
        }), 200
    else:
        return jsonify({
            "status": "error",
            "message": "Failed to update book record."
        }), 500

@app.route("/api/admin/books/<int:book_id>", methods=["DELETE"])
def admin_delete_book(book_id):
    """Delete a book from the catalog (Admin only)."""
    if not check_admin_auth():
        return jsonify({"status": "error", "message": "Unauthorized"}), 401

    existing = get_book_by_id(book_id)
    if not existing:
        return jsonify({"status": "error", "message": f"Book ID {book_id} not found."}), 404

    deleted = delete_book(book_id)
    if deleted:
        return jsonify({
            "status": "success",
            "message": f"Book '{existing['title']}' deleted successfully."
        }), 200
    else:
        return jsonify({
            "status": "error",
            "message": "Failed to delete book record."
        }), 500

# ========================================================
# ERROR HANDLERS
# ========================================================

@app.errorhandler(404)
def not_found(e):
    return jsonify({"status": "error", "message": "Resource not found."}), 404

@app.errorhandler(500)
def server_error(e):
    return jsonify({"status": "error", "message": "Internal server error."}), 500

if __name__ == "__main__":
    print("🚀 Starting SmartBook Flask Backend on http://localhost:5000 ...")
    app.run(host="127.0.0.1", port=5000, debug=True)
