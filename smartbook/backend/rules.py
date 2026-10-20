"""
rules.py - Knowledge Base of Predefined IF-THEN Expert Rules
Contains expert rules used by the forward chaining inference engine to recommend books.
Each rule defines conditions, recommendation action, weight, and human-readable explanation.
"""

# Knowledge Base containing 20 curated expert rules
RECOMMENDATION_RULES = [
    {
        "rule_id": "RULE_01",
        "name": "Curious Detective & Mystery Rule",
        "conditions": {
            "genre": "Mystery",
            "mood": "Curious"
        },
        "target_genre": "Mystery",
        "target_mood": "Curious",
        "action": "Recommend classic mystery, detective inquiries, and investigative narratives.",
        "explanation": "You selected Mystery genre with a Curious mood, which triggers our detective reasoning pattern.",
        "weight": 25
    },
    {
        "rule_id": "RULE_02",
        "name": "Motivational Self-Help Rule",
        "conditions": {
            "genre": "Self-Help",
            "reading_purpose": "Motivation"
        },
        "target_genre": "Self-Help",
        "target_purpose": "Motivation",
        "action": "Recommend high-impact motivational literature, habit engineering, and mindset coaching.",
        "explanation": "You selected Self-Help with the goal of Motivation, matching our personal breakthrough rule.",
        "weight": 25
    },
    {
        "rule_id": "RULE_03",
        "name": "Technology Learning Rule",
        "conditions": {
            "genre": "Technology",
            "reading_purpose": "Learning"
        },
        "target_genre": "Technology",
        "target_purpose": "Learning",
        "action": "Recommend software engineering craftsmanship, programming architecture, and computing foundations.",
        "explanation": "You selected Technology with a Learning purpose, matching our technical mastery curriculum rule.",
        "weight": 25
    },
    {
        "rule_id": "RULE_04",
        "name": "Emotional Romance Rule",
        "conditions": {
            "genre": "Romance",
            "mood": "Emotional"
        },
        "target_genre": "Romance",
        "target_mood": "Emotional",
        "action": "Recommend evocative romantic novels exploring relationships, sacrifice, and deep human bonds.",
        "explanation": "You selected Romance with an Emotional mood, matching our heart-stirring relationship narrative rule.",
        "weight": 25
    },
    {
        "rule_id": "RULE_05",
        "name": "Adventurous Fantasy Quest Rule",
        "conditions": {
            "genre": "Fantasy",
            "mood": "Adventurous"
        },
        "target_genre": "Fantasy",
        "target_mood": "Adventurous",
        "action": "Recommend world-building fantasy epics, magical journeys, and hero quests.",
        "explanation": "You selected Fantasy with an Adventurous mood, activating our heroic quest exploration rule.",
        "weight": 25
    },
    {
        "rule_id": "RULE_06",
        "name": "Beginner Accessibility Rule",
        "conditions": {
            "reading_difficulty": "Beginner"
        },
        "target_difficulty": "Beginner",
        "action": "Prioritize accessible, highly engaging books with approachable prose and clear narrative flow.",
        "explanation": "You indicated a Beginner reading level; prioritizing clear, engaging books without dense barrier-to-entry prose.",
        "weight": 15
    },
    {
        "rule_id": "RULE_07",
        "name": "Short Read Preference Rule",
        "conditions": {
            "preferred_length": "Short"
        },
        "target_length": "Short",  # < 200 pages
        "action": "Prioritize concise books under 200 pages suitable for swift completion.",
        "explanation": "You preferred a Short read; prioritizing impactful titles with under 200 pages.",
        "weight": 10
    },
    {
        "rule_id": "RULE_08",
        "name": "Marathi Language Mandatory Filter Rule",
        "conditions": {
            "language": "Marathi"
        },
        "target_language": "Marathi",
        "action": "Filter exclusively to original or authorized Marathi literature.",
        "explanation": "You selected Marathi as your preferred language; restricting catalog strictly to Marathi works.",
        "weight": 0  # Handled as mandatory filter
    },
    {
        "rule_id": "RULE_09",
        "name": "Hindi Language Mandatory Filter Rule",
        "conditions": {
            "language": "Hindi"
        },
        "target_language": "Hindi",
        "action": "Filter exclusively to authentic Hindi classics, poetry, and modern literature.",
        "explanation": "You selected Hindi as your preferred language; restricting catalog strictly to Hindi works.",
        "weight": 0  # Handled as mandatory filter
    },
    {
        "rule_id": "RULE_10",
        "name": "English Language Mandatory Filter Rule",
        "conditions": {
            "language": "English"
        },
        "target_language": "English",
        "action": "Filter exclusively to English global bestsellers and classic literature.",
        "explanation": "You selected English as your preferred language; catalog is focused on English editions.",
        "weight": 0  # Handled as mandatory filter
    },
    {
        "rule_id": "RULE_11",
        "name": "Personal Development Purpose Rule",
        "conditions": {
            "reading_purpose": "Personal Development"
        },
        "target_purpose": "Personal Development",
        "action": "Boost books that promote self-discipline, financial IQ, cognitive training, and character growth.",
        "explanation": "You chose Personal Development as your reading purpose, boosting books designed to improve daily life.",
        "weight": 15
    },
    {
        "rule_id": "RULE_12",
        "name": "Curious Science Fiction Rule",
        "conditions": {
            "genre": "Science Fiction",
            "mood": "Curious"
        },
        "target_genre": "Science Fiction",
        "target_mood": "Curious",
        "action": "Recommend speculative hard sci-fi, physics exploration, and cosmos inquiries.",
        "explanation": "You selected Science Fiction with a Curious mood, matching our cosmos and frontier exploration rule.",
        "weight": 25
    },
    {
        "rule_id": "RULE_13",
        "name": "Inspiring Biography Rule",
        "conditions": {
            "genre": "Biography"
        },
        "target_genre": "Biography",
        "action": "Recommend real-world autobiographies and historical life memoirs of visionary leaders.",
        "explanation": "You selected Biography, matching our real-world role model and life story rule.",
        "weight": 20
    },
    {
        "rule_id": "RULE_14",
        "name": "Civilization & History Knowledge Rule",
        "conditions": {
            "genre": "History",
            "reading_purpose": "Knowledge"
        },
        "target_genre": "History",
        "target_purpose": "Knowledge",
        "action": "Recommend deep historical analyses, societal evolutions, and landmark civilizational events.",
        "explanation": "You chose History for Knowledge, matching our historical truth and cultural evolution rule.",
        "weight": 25
    },
    {
        "rule_id": "RULE_15",
        "name": "Psychological Horror & Thriller Rule",
        "conditions": {
            "genre": "Horror",
            "mood": "Emotional"
        },
        "target_genre": "Horror",
        "target_mood": "Emotional",
        "action": "Recommend psychological dread, supernatural horror, and atmospheric suspense novels.",
        "explanation": "You selected Horror with an Emotional mood, matching our spine-chilling gothic suspense rule.",
        "weight": 25
    },
    {
        "rule_id": "RULE_16",
        "name": "Relaxing Light Fiction Rule",
        "conditions": {
            "genre": "Fiction",
            "mood": "Relaxed"
        },
        "target_genre": "Fiction",
        "target_mood": "Relaxed",
        "action": "Recommend engaging, heartwarming, and comforting fiction for easy leisurely reading.",
        "explanation": "You selected Fiction with a Relaxed mood, matching our comforting leisurely narrative rule.",
        "weight": 25
    },
    {
        "rule_id": "RULE_17",
        "name": "Advanced Mastery Rule",
        "conditions": {
            "reading_difficulty": "Advanced"
        },
        "target_difficulty": "Advanced",
        "action": "Prioritize complex, intellectually rigorous, multi-layered philosophical or technical tomes.",
        "explanation": "You indicated an Advanced reading level, giving preference to rich, challenging literature.",
        "weight": 15
    },
    {
        "rule_id": "RULE_18",
        "name": "Long Immersive Book Rule",
        "conditions": {
            "preferred_length": "Long"
        },
        "target_length": "Long",  # > 400 pages
        "action": "Prioritize expansive epics exceeding 400 pages for deep immersion.",
        "explanation": "You selected Long books (>400 pages); boosting comprehensive, world-building sagas.",
        "weight": 10
    },
    {
        "rule_id": "RULE_19",
        "name": "Entertaining Adventure Quest Rule",
        "conditions": {
            "reading_purpose": "Entertainment",
            "mood": "Adventurous"
        },
        "target_purpose": "Entertainment",
        "target_mood": "Adventurous",
        "action": "Recommend fast-paced thrills, exploration, and immersive entertainment.",
        "explanation": "You want thrilling Entertainment with an Adventurous mood, triggering our fast-paced escapism rule.",
        "weight": 20
    },
    {
        "rule_id": "RULE_20",
        "name": "Knowledge & Medium Length Rule",
        "conditions": {
            "reading_purpose": "Knowledge",
            "preferred_length": "Medium"
        },
        "target_purpose": "Knowledge",
        "target_length": "Medium",  # 200 - 400 pages
        "action": "Recommend balanced non-fiction digests between 200 and 400 pages that maximize learning per hour.",
        "explanation": "You seek Knowledge in a Medium-length format (200-400 pages), matching our focused insight rule.",
        "weight": 15
    }
]

def get_all_rules():
    """Return all active recommendation rules."""
    return RECOMMENDATION_RULES

def get_rule_by_id(rule_id):
    """Retrieve rule definition by its unique ID."""
    for rule in RECOMMENDATION_RULES:
        if rule["rule_id"] == rule_id:
            return rule
    return None
