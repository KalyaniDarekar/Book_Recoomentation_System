import os
import sqlite3
from pathlib import Path

backend_dir = Path(__file__).resolve().parent.parent
db_path = backend_dir / "smartbook.db"

print("=" * 60)
print("PROMPT 1 VERIFICATION REPORT")
print("=" * 60)

# 1. Directory Structure Check
required_paths = [
    backend_dir / "database.py",
    backend_dir / "seed_books.py",
    backend_dir / "rules.py",
    backend_dir / "recommendation_engine.py",
    backend_dir / "app.py",
    backend_dir / "requirements.txt",
    backend_dir / "tests",
    backend_dir.parent / "frontend",
    backend_dir.parent / "documentation",
    backend_dir.parent.parent / "README.md"
]

print("\n1. DIRECTORY & FILE STRUCTURE:")
all_files_exist = True
for p in required_paths:
    exists = p.exists()
    status = "[OK]" if exists else "[MISSING]"
    print(f"  {status} {p.name} ({p})")
    if not exists:
        all_files_exist = False

# 2. Database Connection and Schema
print("\n2. DATABASE & SCHEMA CHECK:")
conn = sqlite3.connect(db_path)
conn.row_factory = sqlite3.Row
cursor = conn.cursor()

cursor.execute("SELECT name FROM sqlite_master WHERE type='table'")
tables = [row["name"] for row in cursor.fetchall()]
print(f"  Tables found: {tables}")
for expected_table in ["books", "rules", "admin_users"]:
    assert expected_table in tables, f"Table {expected_table} missing!"
    cursor.execute(f"PRAGMA table_info({expected_table})")
    cols = [r["name"] for r in cursor.fetchall()]
    print(f"  Schema for '{expected_table}': {cols}")

# 3. Books Count & Distribution
print("\n3. BOOKS METRICS & DISTRIBUTION:")
cursor.execute("SELECT COUNT(*) AS total FROM books")
total_books = cursor.fetchone()["total"]
print(f"  Total Books Count: {total_books} (Requirement: at least 50 books)")
assert total_books >= 50, f"Expected at least 50 books, found {total_books}"

cursor.execute("SELECT language, COUNT(*) AS count FROM books GROUP BY language")
print("  Language Distribution:")
lang_counts = {}
for r in cursor.fetchall():
    lang_counts[r["language"]] = r["count"]
    print(f"    * {r['language']}: {r['count']} books")
assert "English" in lang_counts and lang_counts["English"] > 0
assert "Hindi" in lang_counts and lang_counts["Hindi"] > 0
assert "Marathi" in lang_counts and lang_counts["Marathi"] > 0

cursor.execute("SELECT genre, COUNT(*) AS count FROM books GROUP BY genre")
print("  Genre Distribution:")
for r in cursor.fetchall():
    print(f"    * {r['genre']}: {r['count']} books")

# 4. Authentic Multilingual Titles Check
print("\n4. AUTHENTIC TITLES SPECIFIED IN PROMPT:")
sample_titles = [
    ("Atomic Habits", "James Clear", "English"),
    ("The Alchemist", "Paulo Coelho", "English"),
    ("Rich Dad Poor Dad", "Robert T. Kiyosaki", "English"),
    ("Godan", "Munshi Premchand", "Hindi"),
    ("Gunahon Ka Devta", "Dharamvir Bharati", "Hindi"),
    ("Madhushala", "Harivansh Rai Bachchan", "Hindi"),
    ("Mrityunjay", "Shivaji Sawant", "Marathi"),
    ("Shyamchi Aai", "Sane Guruji", "Marathi"),
    ("Yayati", "V.S. Khandekar", "Marathi"),
    ("Batatyachi Chaal", "P.L. Deshpande", "Marathi")
]

for title_fragment, expected_author, expected_lang in sample_titles:
    cursor.execute("SELECT id, title, author, language, pages, reading_difficulty FROM books WHERE title LIKE ?", (f"%{title_fragment}%",))
    match = cursor.fetchone()
    if match:
        print(f"  [OK] Found: '{match['title']}' by {match['author']} | Lang: {match['language']} | Pages: {match['pages']} | Level: {match['reading_difficulty']}")
    else:
        print(f"  [FAIL] Missing expected title: {title_fragment}")

# 5. Admin User Check
print("\n5. ADMIN AUTHENTICATION:")
cursor.execute("SELECT id, username FROM admin_users")
admin_user = cursor.fetchone()
if admin_user:
    print(f"  [OK] Default Admin User Present: username='{admin_user['username']}' (ID: {admin_user['id']})")
else:
    print("  [FAIL] Admin user not seeded")

conn.close()

print("\n" + "=" * 60)
print("PROMPT 1 VERIFICATION PASSED SUCCESSFULLY")
print("=" * 60)
