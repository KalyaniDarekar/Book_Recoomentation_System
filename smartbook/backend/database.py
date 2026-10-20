"""
database.py - SQLite Database Management for SmartBook Recommendation System
Handles connection lifecycle, schema initialization, and standard query operations.
"""

import sqlite3
import os
from pathlib import Path
from werkzeug.security import generate_password_hash, check_password_hash

# Resolve database file path relative to this script
DB_PATH = Path(__file__).resolve().parent / "smartbook.db"

def get_db_connection():
    """Establish and return a connection to the SQLite database with Row factory."""
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def init_db():
    """Initialize database tables for books, rules, and admin users."""
    conn = get_db_connection()
    cursor = conn.cursor()

    # 1. Books Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS books (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            author TEXT NOT NULL,
            genre TEXT NOT NULL,
            description TEXT NOT NULL,
            language TEXT NOT NULL,
            pages INTEGER NOT NULL,
            reading_difficulty TEXT NOT NULL,
            suitable_mood TEXT NOT NULL,
            reading_purpose TEXT NOT NULL,
            cover_image TEXT NOT NULL,
            rating REAL DEFAULT 4.5,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # 2. Rules Table (Knowledge Base)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS rules (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            rule_id TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            genre TEXT,
            mood TEXT,
            reading_difficulty TEXT,
            preferred_length TEXT,
            language TEXT,
            reading_purpose TEXT,
            action TEXT NOT NULL,
            explanation TEXT NOT NULL,
            weight INTEGER DEFAULT 10,
            is_active INTEGER DEFAULT 1,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # 3. Admin Users Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS admin_users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            username TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    """)

    # Seed default admin user (admin / smartbook123) if not present
    cursor.execute("SELECT id FROM admin_users WHERE username = ?", ("admin",))
    if not cursor.fetchone():
        hashed_pw = generate_password_hash("smartbook123")
        cursor.execute(
            "INSERT INTO admin_users (username, password_hash) VALUES (?, ?)",
            ("admin", hashed_pw)
        )

    conn.commit()
    conn.close()
    print(f"Database initialized successfully at: {DB_PATH}")

def get_all_books(genre=None, language=None, difficulty=None, search=None):
    """Retrieve all books from the database with optional filtering."""
    conn = get_db_connection()
    cursor = conn.cursor()

    query = "SELECT * FROM books WHERE 1=1"
    params = []

    if genre and genre != "All":
        query += " AND genre = ?"
        params.append(genre)
    if language and language != "All":
        query += " AND language = ?"
        params.append(language)
    if difficulty and difficulty != "All":
        query += " AND reading_difficulty = ?"
        params.append(difficulty)
    if search:
        query += " AND (title LIKE ? OR author LIKE ? OR description LIKE ?)"
        term = f"%{search}%"
        params.extend([term, term, term])

    query += " ORDER BY rating DESC, title ASC"
    cursor.execute(query, params)
    books = [dict(row) for row in cursor.fetchall()]
    conn.close()
    return books

def get_book_by_id(book_id):
    """Retrieve a single book by its ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT * FROM books WHERE id = ?", (book_id,))
    row = cursor.fetchone()
    conn.close()
    return dict(row) if row else None

def add_book(book_data):
    """Insert a new book record into the database."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        INSERT INTO books (
            title, author, genre, description, language,
            pages, reading_difficulty, suitable_mood, reading_purpose,
            cover_image, rating
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    """, (
        book_data['title'],
        book_data['author'],
        book_data['genre'],
        book_data['description'],
        book_data['language'],
        int(book_data['pages']),
        book_data['reading_difficulty'],
        book_data['suitable_mood'],
        book_data['reading_purpose'],
        book_data['cover_image'],
        float(book_data.get('rating', 4.5))
    ))
    new_id = cursor.lastrowid
    conn.commit()
    conn.close()
    return new_id

def update_book(book_id, book_data):
    """Update an existing book record."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("""
        UPDATE books SET
            title = ?, author = ?, genre = ?, description = ?,
            language = ?, pages = ?, reading_difficulty = ?,
            suitable_mood = ?, reading_purpose = ?, cover_image = ?,
            rating = ?
        WHERE id = ?
    """, (
        book_data['title'],
        book_data['author'],
        book_data['genre'],
        book_data['description'],
        book_data['language'],
        int(book_data['pages']),
        book_data['reading_difficulty'],
        book_data['suitable_mood'],
        book_data['reading_purpose'],
        book_data['cover_image'],
        float(book_data.get('rating', 4.5)),
        book_id
    ))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return affected > 0

def delete_book(book_id):
    """Delete a book record by its ID."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("DELETE FROM books WHERE id = ?", (book_id,))
    affected = cursor.rowcount
    conn.commit()
    conn.close()
    return affected > 0

def verify_admin(username, password):
    """Check admin credentials."""
    conn = get_db_connection()
    cursor = conn.cursor()
    cursor.execute("SELECT password_hash FROM admin_users WHERE username = ?", (username,))
    row = cursor.fetchone()
    conn.close()
    if row and check_password_hash(row['password_hash'], password):
        return True
    return False

if __name__ == "__main__":
    init_db()
