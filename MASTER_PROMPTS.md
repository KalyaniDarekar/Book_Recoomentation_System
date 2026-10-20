# SMARTBOOK – MASTER PROMPT ROADMAP
## Rule-Based Book Recommendation System (AI Mini Project)

This document breaks down the entire **SmartBook** project into sequential, executable tasks. You can run these tasks one by one with your AI assistant, or execute them in order to develop, test, and verify every layer of the system.

---

## 📋 Task Index & Execution Flow

| Task # | Task Title | Key Deliverables | Status |
|---|---|---|---|
| **Task 1** | Project Directory & Database Foundation | Folder structure, SQLite schema, `database.py`, `seed_books.py` (50+ books: English, Hindi, Marathi) | ✅ Completed |
| **Task 2** | AI Rule-Based Engine & Unit Tests | `rules.py` (15+ IF-THEN rules), `recommendation_engine.py` (Forward chaining, weighted scoring 0-100, explanations), `test_engine.py` | ✅ Completed |
| **Task 3** | Flask REST API & Backend Endpoints | `app.py`, Flask-CORS, REST routes (`/api/books`, `/api/recommend`, `/api/rules`, `/api/admin/*`), error handling | ✅ Completed |
| **Task 4** | Frontend Setup & Design System | Vite + React + Tailwind CSS, Lucide icons, Theme setup (digital library aesthetic, purple-blue gradient, typography) | ✅ Completed |
| **Task 5** | Home Page & Book Explorer | Landing Page (Hero, How It Works, Featured), Book Explorer with search & multi-attribute filters | ✅ Completed |
| **Task 6** | Interactive Preference Questionnaire | 6-question preference wizard with animated steps, progress bar, validation, and submission handler | ✅ Completed |
| **Task 7** | Recommendation Results & Explainable AI (XAI) | Results view (Top 5 matches, match scores, rule triggers), "How Our AI Made This Decision" transparent inference panel | ✅ Completed |
| **Task 8** | Admin Dashboard & Rule Inspector | Protected Admin Panel, Books CRUD manager, Rule viewer & editor, system status | ✅ Completed |
| **Task 9** | End-to-End Integration, Viva Prep & Documentation | `README.md`, Mermaid architecture diagrams, viva Q&A guide, setup instructions | ✅ Completed |

---

## 📌 PROMPT 1: Project Setup & SQLite Database Foundation

### Objective
Initialize the project structure and create an SQLite database populated with at least 50 real, verified books across English, Hindi, and Marathi with rich metadata.

### Tasks to Execute:
1. Create directory structure:
   ```
   smartbook/
   ├── backend/
   │   ├── database.py
   │   ├── seed_books.py
   │   ├── rules.py
   │   ├── recommendation_engine.py
   │   ├── app.py
   │   ├── requirements.txt
   │   └── tests/
   ├── frontend/
   ├── documentation/
   └── README.md
   ```
2. In `backend/database.py`, establish SQLite connection and table definitions:
   - `books` table (id, title, author, genre, description, language, pages, reading_difficulty, suitable_mood, reading_purpose, cover_image, rating)
   - `rules` table (id, rule_code, name, conditions_json, action, explanation, is_active)
   - `admin_users` table (id, username, password_hash)
3. In `backend/seed_books.py`, curate at least 50 authentic books:
   - Diverse genres: Fiction, Mystery, Romance, Sci-Fi, Fantasy, Horror, Biography, Self-Help, Technology, History.
   - Real Hindi books (e.g., *Godan* by Premchand, *Gunahon Ka Devta* by Dharamvir Bharati, *Madhushala* by Harivansh Rai Bachchan, *Raag Darbari* by Shrilal Shukla).
   - Real Marathi books (e.g., *Shyamchi Aai* by Sane Guruji, *Yayati* by V.S. Khandekar, *Mrityunjay* by Shivaji Sawant, *Batatyachi Chaal* by P.L. Deshpande, *Kosala* by Bhalchandra Nemade).
   - High-quality, reliable Open Library / Wikimedia cover image links with fallback placeholders.
4. Add `backend/requirements.txt` (`Flask`, `Flask-CORS`, `pytest`).
5. Execute seed script and verify database creation.

---

## 📌 PROMPT 2: Rule-Based Recommendation Engine & Testing

### Objective
Implement the forward-chaining rule-based expert system in pure Python without black-box ML or external APIs.

### Tasks to Execute:
1. In `backend/rules.py`, define 18+ structured IF-THEN recommendation rules.
   - Each rule must contain: `rule_id`, `conditions` (dict of criteria: genre, mood, reading_difficulty, reading_purpose, preferred_length), `action` (target traits/boosts), `weight`, and `explanation`.
   - Examples:
     - *RULE_01*: Mystery + Curious → Boost Mystery/Detective
     - *RULE_02*: Self-Help + Motivation → Boost Personal Development
     - *RULE_03*: Technology + Learning → Boost Programming/Tech
     - *RULE_04*: Romance + Emotional → Boost Romantic Literature
     - *RULE_05*: Fantasy + Adventurous → Boost Fantasy/Adventure
     - *RULE_06*: Beginner Experience → Boost Easy Difficulty
     - *RULE_07*: Short Length (<200 pages) → Boost Low Page Counts
     - *RULE_08*: Language Filter → Strict match condition
2. In `backend/recommendation_engine.py`, build the inference engine:
   - **Forward Chaining Inference**: Match user inputs against working memory (facts).
   - **Mandatory Hard Filters**: Enforce language strictly (if user selects Marathi, only Marathi books are eligible; display clear explanation if none match).
   - **Weighted Scoring Algorithm** (Total 100 points max):
     - Genre Match: 40 pts
     - Mood Match: 20 pts
     - Purpose Match: 15 pts
     - Reading Level Match: 15 pts
     - Book Length Match: 10 pts
   - **Deduplication**: Prevent double-counting multiple overlapping rules.
   - **Explainability Tracer**: Record triggered rules, point breakdown, and a natural language explanation for why each book was picked.
3. In `backend/tests/test_recommendation.py`, write unit tests:
   - Test Case 1: Mystery + Curious + English → Validates top mystery results.
   - Test Case 2: Self-Help + Motivated + Beginner → Validates Atomic Habits/Rich Dad Poor Dad.
   - Test Case 3: Marathi Language Filter → Only Marathi books returned.
   - Test Case 4: Explanation generator verification.

---

## 📌 PROMPT 3: Flask Backend REST API

### Objective
Expose the recommendation engine, database operations, and admin capabilities through clean RESTful JSON endpoints.

### Tasks to Execute:
1. In `backend/app.py`, implement Flask app with CORS enabled:
   - `GET /api/books` - Retrieve all books (supports query params: `genre`, `language`, `search`, `page`).
   - `GET /api/books/<id>` - Retrieve specific book details.
   - `POST /api/recommend` - Submit preference payload, run recommendation engine, return top 5 books + compatibility score + triggered rules + explanations.
   - `GET /api/rules` - View active expert rules.
   - `POST /api/admin/login` - Simple secure authentication for admin operations.
   - `POST /api/admin/books` - Create new book.
   - `PUT /api/admin/books/<id>` - Update existing book.
   - `DELETE /api/admin/books/<id>` - Delete book.
   - `POST /api/admin/rules` - Add/toggle rule activation.
2. Add input validation for all preference options (Genre, Mood, Experience, Length, Language, Purpose).
3. Test all endpoints via curl or test script.

---

## 📌 PROMPT 4: React + Vite Frontend Setup & Design System

### Objective
Initialize the frontend application using modern React (Vite), Tailwind CSS, and create the modern digital library aesthetic.

### Tasks to Execute:
1. Initialize Vite React project in `frontend/`.
2. Install dependencies: `lucide-react`, `react-router-dom`.
3. Configure `tailwind.config.js` with modern color palette:
   - Primary: Deep indigo/violet (`#4F46E5`, `#6366F1`)
   - Accent: Radiant purple/cyan (`#8B5CF6`, `#06B6D4`)
   - Surface: Clean card whites and subtle slate borders (`#F8FAFC`, `#E2E8F0`)
   - Glassmorphic card styling and soft shadow tokens.
4. Setup `frontend/src/services/api.js` to communicate with the Flask backend (`http://localhost:5000/api`).
5. Build persistent layout components:
   - `Navbar.jsx`: SmartBook branding, navigation links (Home, Find Books, Explorer, Admin), responsive mobile toggle.
   - `Footer.jsx`: Academic project info, college viva details, GitHub links, disclaimer.

---

## 📌 PROMPT 5: Home Page & Book Explorer

### Objective
Build an impressive, high-converting Home Landing Page and an interactive Book Explorer with real-time filters.

### Tasks to Execute:
1. Build `frontend/src/pages/HomePage.jsx`:
   - **Hero Section**: "Discover Your Next Favorite Book" with purple-blue gradient glow, subtitle, "Get Recommendations" CTA, and "Explore Library" button.
   - **Featured Books Carousel / Grid**: Show top-rated titles across categories.
   - **How It Works Section**: 3-step visual cards (1. Share Preferences → 2. AI Rule Matching → 3. Get Explainable Recommendations).
   - **Academic Badge**: "College AI Mini-Project: Rule-Based Expert System".
2. Build `frontend/src/pages/BookExplorer.jsx`:
   - Search bar (search by title or author).
   - Filter bar: Genre pills, Language dropdown (English, Hindi, Marathi), Difficulty level (Beginner, Intermediate, Advanced).
   - Book grid with cover image, genre badge, language tag, rating stars, page count, and "View Details" modal.
   - Empty state handling when no books match filters.

---

## 📌 PROMPT 6: Interactive Preference Questionnaire

### Objective
Create a step-by-step interactive questionnaire collecting user reading preferences with immediate visual feedback.

### Tasks to Execute:
1. Build `frontend/src/pages/RecommendationForm.jsx`:
   - Interactive 6-question questionnaire:
     - Q1: Favorite Genre (Fiction, Mystery, Romance, Sci-Fi, Fantasy, Horror, Biography, Self-Help, Technology, History)
     - Q2: Current Reading Mood (Happy, Motivated, Curious, Emotional, Adventurous, Relaxed)
     - Q3: Reading Experience (Beginner, Intermediate, Advanced)
     - Q4: Preferred Length (Short <200 pages, Medium 200-400 pages, Long >400 pages)
     - Q5: Preferred Language (English, Hindi, Marathi)
     - Q6: Purpose for Reading (Entertainment, Learning, Motivation, Knowledge, Personal Development)
   - Visual enhancements:
     - Card selection with icons for each option.
     - Step progress indicator (e.g., Step 3 of 6) with smooth transitions.
     - Ability to navigate Back and Next, or view as a single seamless form.
     - Form validation ensuring all fields are chosen.
   - Submit action labeled "Find My Books" with smooth loading animation showing "Evaluating AI Rules...".

---

## 📌 PROMPT 7: Recommendation Results & Explainable AI (XAI) Panel

### Objective
Build the recommendation results screen displaying the Top 5 matched books, compatibility scores, and the transparent Explainable AI decision breakdown.

### Tasks to Execute:
1. Build `frontend/src/pages/ResultsPage.jsx`:
   - Header: "Your Personalized Book Recommendations".
   - Top 5 Recommended Book Cards:
     - High-resolution Book Cover.
     - Title, Author, Genre tag, Language badge.
     - **Compatibility Score Meter** (e.g., `95% Match` with score breakdown tooltip).
     - Page count, Reading level, Description snippet.
     - Personalized reason badge ("Recommended because you selected Self-Help + Motivation").
   - Action buttons: "Try Again (Modify Preferences)", "Explore More Books", "Print / Save Recommendations".
2. Build the **Explainable AI (XAI) Component** (`ExplainableAISection.jsx`):
   - Section Title: "🧠 How Our AI Made This Decision".
   - **Inference Summary Table**:
     - User Input Facts (Genre, Mood, Level, Purpose, Language).
     - Fired Rules list (Rule IDs, Rule premise, action triggered).
     - Weighted Score Breakdown (Genre Match: +40, Mood: +20, etc.).
   - Interactive Rule Inspector modal: click on any recommended book to see exactly which rules caused it to rank.
   - Handle edge case: If no books match the language filter, present a graceful guidance alert.

---

## 📌 PROMPT 8: Admin Panel & Rule Management

### Objective
Implement an administrative dashboard to manage the book inventory and inspect/adjust the expert system rules.

### Tasks to Execute:
1. Build `frontend/src/pages/AdminPage.jsx`:
   - Simple credential login modal/form (default: `admin` / `smartbook123`).
   - Tab 1: **Book Catalog Management**:
     - Data table listing all 50+ books with pagination.
     - "Add New Book" modal with complete field validation.
     - "Edit Book" and "Delete Book" with confirmation alerts.
   - Tab 2: **AI Rule Inspector**:
     - List all 15+ IF-THEN rules with their condition logic and explanation text.
     - Toggle rule active/inactive status to demonstrate live rule adjustments during a viva presentation.
   - Tab 3: **Quick Test Simulator**:
     - Test preferences right from the admin panel to preview rule execution.

---

## 📌 PROMPT 9: Project Documentation, System Diagrams & Viva Guide

### Objective
Generate complete project documentation, system diagrams, and an academic viva defense guide.

### Tasks to Execute:
1. Create `README.md` covering:
   - Project Title, Abstract, Motivation.
   - System Architecture (Frontend, Flask Backend, SQLite DB, Rule Engine).
   - Explanation of Rule-Based AI vs Machine Learning (why rule-based systems are deterministic, transparent, and auditable).
   - Forward Chaining Algorithm step-by-step description.
   - Setup & Run Instructions for Windows (PowerShell/CMD).
   - Sample Test Scenarios with inputs and expected outputs.
2. Generate Mermaid Diagrams:
   - System Architecture Diagram.
   - Recommendation Engine Flowchart (Input → Fact Extraction → Language Filtering → Rule Matching → Score Computation → Sorting → Top 5 + XAI).
3. Create `documentation/VIVA_QUESTIONS.md`:
   - 20 common college viva questions & model answers on Rule-Based Systems, Forward Chaining, Knowledge Bases, and Inference Engines.
