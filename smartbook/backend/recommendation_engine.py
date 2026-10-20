"""
recommendation_engine.py - Rule-Based Expert System Inference Engine
Implements forward chaining reasoning, weighted scoring (0-100),
mandatory language constraint filtering, and transparent Explainable AI (XAI) tracing.
"""

from rules import RECOMMENDATION_RULES, get_all_rules
from database import get_all_books

# Scoring Weights defined according to AI System Specification
WEIGHT_GENRE = 40
WEIGHT_MOOD = 20
WEIGHT_PURPOSE = 15
WEIGHT_DIFFICULTY = 15
WEIGHT_LENGTH = 10
MAX_SCORE = WEIGHT_GENRE + WEIGHT_MOOD + WEIGHT_PURPOSE + WEIGHT_DIFFICULTY + WEIGHT_LENGTH # 100

def classify_page_length(pages: int) -> str:
    """
    Categorize book page count into standard preference buckets.
    - Short: < 200 pages
    - Medium: 200 - 400 pages
    - Long: > 400 pages
    """
    if pages < 200:
        return "Short"
    elif 200 <= pages <= 400:
        return "Medium"
    else:
        return "Long"

def evaluate_rules_forward_chaining(user_prefs: dict, active_rules=None):
    """
    Step 3 of Algorithm:
    Forward Chaining inference: match user facts against predefined IF-THEN rules.
    Returns list of matched rules and their explanations.
    """
    if active_rules is None:
        active_rules = get_all_rules()

    matched_rules = []
    
    # Normalize user inputs
    norm_genre = user_prefs.get("genre", "").strip()
    norm_mood = user_prefs.get("mood", "").strip()
    norm_difficulty = user_prefs.get("reading_difficulty") or user_prefs.get("experience", "").strip()
    norm_length = user_prefs.get("preferred_length", "").strip()
    norm_language = user_prefs.get("language", "").strip()
    norm_purpose = user_prefs.get("reading_purpose") or user_prefs.get("purpose", "").strip()

    user_facts = {
        "genre": norm_genre,
        "mood": norm_mood,
        "reading_difficulty": norm_difficulty,
        "preferred_length": norm_length,
        "language": norm_language,
        "reading_purpose": norm_purpose
    }

    for rule in active_rules:
        conditions = rule.get("conditions", {})
        # Check if all conditions in the IF clause are satisfied by user facts
        all_conditions_met = True
        for key, expected_value in conditions.items():
            fact_val = user_facts.get(key, "")
            if not fact_val or fact_val.lower() != str(expected_value).lower():
                all_conditions_met = False
                break
        
        if all_conditions_met:
            matched_rules.append(rule)

    return matched_rules, user_facts

def calculate_book_score(book: dict, user_facts: dict):
    """
    Step 5 of Algorithm:
    Calculate deterministic recommendation score (0-100) using predefined weights.
    Avoids double-counting and produces a transparent point breakdown.
    """
    breakdown = {}
    total_score = 0
    match_reasons = []

    # 1. Genre Match (40 pts)
    if book.get("genre", "").strip().lower() == user_facts.get("genre", "").strip().lower():
        total_score += WEIGHT_GENRE
        breakdown["genre_match"] = WEIGHT_GENRE
        match_reasons.append(f"Genre: {book.get('genre')}")
    else:
        breakdown["genre_match"] = 0

    # 2. Mood Match (20 pts)
    if book.get("suitable_mood", "").strip().lower() == user_facts.get("mood", "").strip().lower():
        total_score += WEIGHT_MOOD
        breakdown["mood_match"] = WEIGHT_MOOD
        match_reasons.append(f"Mood: {book.get('suitable_mood')}")
    else:
        breakdown["mood_match"] = 0

    # 3. Purpose Match (15 pts)
    if book.get("reading_purpose", "").strip().lower() == user_facts.get("reading_purpose", "").strip().lower():
        total_score += WEIGHT_PURPOSE
        breakdown["purpose_match"] = WEIGHT_PURPOSE
        match_reasons.append(f"Purpose: {book.get('reading_purpose')}")
    else:
        breakdown["purpose_match"] = 0

    # 4. Reading Difficulty / Level Match (15 pts)
    if book.get("reading_difficulty", "").strip().lower() == user_facts.get("reading_difficulty", "").strip().lower():
        total_score += WEIGHT_DIFFICULTY
        breakdown["difficulty_match"] = WEIGHT_DIFFICULTY
        match_reasons.append(f"Reading Level: {book.get('reading_difficulty')}")
    else:
        breakdown["difficulty_match"] = 0

    # 5. Book Length Category Match (10 pts)
    book_length_cat = classify_page_length(int(book.get("pages", 0)))
    if book_length_cat.lower() == user_facts.get("preferred_length", "").strip().lower():
        total_score += WEIGHT_LENGTH
        breakdown["length_match"] = WEIGHT_LENGTH
        match_reasons.append(f"Length: {book_length_cat} ({book.get('pages')} pages)")
    else:
        breakdown["length_match"] = 0

    # Format human-readable explanation
    if match_reasons:
        explanation = "Recommended because this book matches your " + ", ".join(match_reasons) + "."
    else:
        explanation = "Recommended as a fallback interest match in your selected language."

    return total_score, breakdown, explanation

def get_recommendations(user_prefs: dict, limit: int = 5):
    """
    Full End-to-End Recommendation Engine Pipeline:
    1. Accept user preferences.
    2. Load books from database.
    3. Evaluate IF-THEN rules via forward chaining.
    4. Apply mandatory language filter.
    5. Calculate compatibility scores with point breakdown.
    6. Sort candidates by score descending and rating descending.
    7. Return top recommended books with transparent XAI details.
    """
    # 1. Forward Chaining rule evaluation
    matched_rules, user_facts = evaluate_rules_forward_chaining(user_prefs)

    selected_language = user_facts.get("language", "English")

    # 2 & 4. Load books with mandatory language constraint
    books = get_all_books(language=selected_language)

    # If no books match the mandatory language filter
    if not books:
        return {
            "status": "warning",
            "message": f"No books currently available in {selected_language}. Please choose another language or add books in the catalog.",
            "user_preferences": user_facts,
            "matched_rules": [
                {
                    "rule_id": r["rule_id"],
                    "name": r["name"],
                    "explanation": r["explanation"]
                } for r in matched_rules
            ],
            "recommendations": []
        }

    scored_books = []
    matched_rule_ids = [r["rule_id"] for r in matched_rules]

    # 5. Evaluate and score every candidate book in the target language
    for book in books:
        score, breakdown, explanation = calculate_book_score(book, user_facts)
        
        # Link fired rules specifically relevant to this book
        book_fired_rules = []
        for r in matched_rules:
            conds = r.get("conditions", {})
            relevant = True
            if "genre" in conds and conds["genre"].lower() != book["genre"].lower():
                relevant = False
            if "mood" in conds and conds["mood"].lower() != book["suitable_mood"].lower():
                relevant = False
            if "reading_difficulty" in conds and conds["reading_difficulty"].lower() != book["reading_difficulty"].lower():
                relevant = False
            if "reading_purpose" in conds and conds["reading_purpose"].lower() != book["reading_purpose"].lower():
                relevant = False
            if "preferred_length" in conds:
                cat = classify_page_length(book["pages"])
                if conds["preferred_length"].lower() != cat.lower():
                    relevant = False
            if relevant:
                book_fired_rules.append(r["rule_id"])

        book_copy = dict(book)
        book_copy["compatibility_score"] = score
        book_copy["score_breakdown"] = breakdown
        book_copy["explanation"] = explanation
        book_copy["matched_rule_ids"] = book_fired_rules or matched_rule_ids[:2]
        scored_books.append(book_copy)

    # 6. Sort books by score descending, then rating descending, then title
    scored_books.sort(
        key=lambda b: (b["compatibility_score"], b.get("rating", 4.0), -b["pages"]),
        reverse=True
    )

    # 7. Select top recommended books
    top_recommendations = scored_books[:limit]

    # Return structured Explainable AI payload
    return {
        "status": "success",
        "user_preferences": user_facts,
        "matched_rules": [
            {
                "rule_id": r["rule_id"],
                "name": r["name"],
                "explanation": r["explanation"],
                "action": r.get("action", "")
            } for r in matched_rules
        ],
        "total_rules_evaluated": len(get_all_rules()),
        "total_rules_fired": len(matched_rules),
        "total_candidates_evaluated": len(books),
        "recommendations": top_recommendations
    }

if __name__ == "__main__":
    # Test sample invocation
    test_prefs = {
        "genre": "Self-Help",
        "mood": "Motivated",
        "reading_difficulty": "Beginner",
        "preferred_length": "Medium",
        "language": "English",
        "reading_purpose": "Personal Development"
    }
    results = get_recommendations(test_prefs)
    print(f"Matched Rules Count: {results['total_rules_fired']}")
    for b in results["recommendations"]:
        print(f"• {b['title']} by {b['author']} | Score: {b['compatibility_score']}% | {b['explanation']}")
