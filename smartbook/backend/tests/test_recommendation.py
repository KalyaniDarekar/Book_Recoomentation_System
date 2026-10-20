"""
test_recommendation.py - Unit Test Suite for Rule-Based Recommendation Engine
Validates forward chaining inference, weighted scoring bounds, language constraints,
dynamic recommendation variations, and Explainable AI (XAI) outputs.
"""

import sys
import os
from pathlib import Path

# Add backend directory to sys.path
backend_dir = Path(__file__).resolve().parent.parent
sys.path.insert(0, str(backend_dir))

import pytest
from recommendation_engine import (
    classify_page_length,
    evaluate_rules_forward_chaining,
    calculate_book_score,
    get_recommendations,
    MAX_SCORE
)
from rules import RECOMMENDATION_RULES

def test_page_length_classification():
    """Verify that page counts are correctly binned into Short, Medium, Long."""
    assert classify_page_length(150) == "Short"
    assert classify_page_length(199) == "Short"
    assert classify_page_length(200) == "Medium"
    assert classify_page_length(320) == "Medium"
    assert classify_page_length(400) == "Medium"
    assert classify_page_length(401) == "Long"
    assert classify_page_length(650) == "Long"

def test_forward_chaining_rule_matching():
    """Ensure rule conditions trigger accurately based on user facts."""
    # Test Mystery + Curious triggers RULE_01
    prefs_mystery = {
        "genre": "Mystery",
        "mood": "Curious",
        "reading_difficulty": "Beginner",
        "preferred_length": "Short",
        "language": "English",
        "reading_purpose": "Entertainment"
    }
    matched_rules, facts = evaluate_rules_forward_chaining(prefs_mystery)
    matched_ids = [r["rule_id"] for r in matched_rules]
    assert "RULE_01" in matched_ids
    assert "RULE_06" in matched_ids  # Beginner rule
    assert "RULE_07" in matched_ids  # Short read rule
    assert "RULE_10" in matched_ids  # English rule

    # Test Self-Help + Motivation triggers RULE_02
    prefs_selfhelp = {
        "genre": "Self-Help",
        "mood": "Motivated",
        "reading_difficulty": "Beginner",
        "preferred_length": "Medium",
        "language": "English",
        "reading_purpose": "Motivation"
    }
    matched_rules_sh, _ = evaluate_rules_forward_chaining(prefs_selfhelp)
    matched_ids_sh = [r["rule_id"] for r in matched_rules_sh]
    assert "RULE_02" in matched_ids_sh

def test_scoring_weights_and_bounds():
    """Verify that scoring is strictly bounded between 0 and 100 points."""
    user_facts = {
        "genre": "Self-Help",
        "mood": "Motivated",
        "reading_difficulty": "Beginner",
        "preferred_length": "Medium",
        "language": "English",
        "reading_purpose": "Personal Development"
    }

    # Perfect match book
    perfect_book = {
        "title": "Atomic Habits",
        "genre": "Self-Help",
        "suitable_mood": "Motivated",
        "reading_purpose": "Personal Development",
        "reading_difficulty": "Beginner",
        "pages": 320
    }
    score, breakdown, explanation = calculate_book_score(perfect_book, user_facts)
    assert score == 100
    assert breakdown["genre_match"] == 40
    assert breakdown["mood_match"] == 20
    assert breakdown["purpose_match"] == 15
    assert breakdown["difficulty_match"] == 15
    assert breakdown["length_match"] == 10
    assert "Atomic Habits" not in explanation  # explanation contains match traits

    # Complete mismatch book
    mismatch_book = {
        "title": "Unrelated Book",
        "genre": "Horror",
        "suitable_mood": "Emotional",
        "reading_purpose": "Entertainment",
        "reading_difficulty": "Advanced",
        "pages": 700
    }
    score_mismatch, breakdown_mismatch, _ = calculate_book_score(mismatch_book, user_facts)
    assert score_mismatch == 0
    assert all(val == 0 for val in breakdown_mismatch.values())

def test_mandatory_language_filter_marathi():
    """Verify that selecting Marathi strictly filters out non-Marathi books."""
    prefs = {
        "genre": "Fiction",
        "mood": "Emotional",
        "reading_difficulty": "Advanced",
        "preferred_length": "Long",
        "language": "Marathi",
        "reading_purpose": "Entertainment"
    }
    results = get_recommendations(prefs, limit=5)
    assert results["status"] == "success"
    assert len(results["recommendations"]) > 0
    for book in results["recommendations"]:
        assert book["language"] == "Marathi"

def test_mandatory_language_filter_hindi():
    """Verify that selecting Hindi strictly filters out non-Hindi books."""
    prefs = {
        "genre": "Fiction",
        "mood": "Emotional",
        "reading_difficulty": "Intermediate",
        "preferred_length": "Medium",
        "language": "Hindi",
        "reading_purpose": "Entertainment"
    }
    results = get_recommendations(prefs, limit=5)
    assert results["status"] == "success"
    assert len(results["recommendations"]) > 0
    for book in results["recommendations"]:
        assert book["language"] == "Hindi"

def test_unsupported_language_graceful_handling():
    """Verify system returns helpful warning when no books match requested language."""
    prefs = {
        "genre": "Fiction",
        "mood": "Happy",
        "reading_difficulty": "Beginner",
        "preferred_length": "Short",
        "language": "French",
        "reading_purpose": "Entertainment"
    }
    results = get_recommendations(prefs, limit=5)
    assert results["status"] == "warning"
    assert len(results["recommendations"]) == 0
    assert "No books currently available in French" in results["message"]

def test_different_inputs_produce_different_recommendations():
    """Verify that the engine produces genuinely dynamic, differentiated recommendations."""
    tech_prefs = {
        "genre": "Technology",
        "mood": "Curious",
        "reading_difficulty": "Advanced",
        "preferred_length": "Long",
        "language": "English",
        "reading_purpose": "Learning"
    }
    romance_prefs = {
        "genre": "Romance",
        "mood": "Emotional",
        "reading_difficulty": "Beginner",
        "preferred_length": "Medium",
        "language": "English",
        "reading_purpose": "Entertainment"
    }

    tech_results = get_recommendations(tech_prefs, limit=3)
    romance_results = get_recommendations(romance_prefs, limit=3)

    tech_titles = [b["title"] for b in tech_results["recommendations"]]
    romance_titles = [b["title"] for b in romance_results["recommendations"]]

    # Ensure recommendations do not overlap
    assert set(tech_titles).isdisjoint(set(romance_titles))
    assert any("Code" in t or "Data" in t or "Programmer" in t for t in tech_titles)
    assert any("Pride" in t or "Before" in t for t in romance_titles)

def test_explainable_ai_payload_structure():
    """Verify that the XAI payload contains all transparency metadata required for college viva."""
    prefs = {
        "genre": "Science Fiction",
        "mood": "Curious",
        "reading_difficulty": "Intermediate",
        "preferred_length": "Medium",
        "language": "English",
        "reading_purpose": "Knowledge"
    }
    results = get_recommendations(prefs, limit=5)
    
    # Engine-level XAI fields
    assert "user_preferences" in results
    assert "matched_rules" in results
    assert results["total_rules_fired"] > 0
    assert results["total_candidates_evaluated"] > 0

    # Book-level XAI fields
    top_book = results["recommendations"][0]
    assert "compatibility_score" in top_book
    assert 0 <= top_book["compatibility_score"] <= 100
    assert "score_breakdown" in top_book
    assert "explanation" in top_book
    assert len(top_book["explanation"]) > 10
