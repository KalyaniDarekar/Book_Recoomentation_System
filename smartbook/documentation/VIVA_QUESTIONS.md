# SmartBook – Viva Voce Examination Questions & Model Answers

> **Subject**: Artificial Intelligence & Knowledge-Based Systems  
> **Target Audience**: Computer Engineering Students & Viva Examiners  
> **Project**: SmartBook – Rule-Based Book Recommendation System

---

### Q1. What is an Expert System, and how does it differ from Machine Learning?
**Answer:**  
An **Expert System** is a classical Artificial Intelligence program designed to solve complex problems and provide advice by mimicking human expertise. It uses **symbolic knowledge** structured as predefined **IF–THEN rules** and an **inference engine**.

**Key Differences**:
- **Expert Systems**: Rely on explicit, deterministic knowledge rules crafted by domain experts. They require **zero training data**, produce **verifiable and explainable decisions**, and guarantee that identical inputs always yield identical outputs.
- **Machine Learning**: Learns implicit patterns and statistical correlations from large historical datasets. ML models often act as "black boxes" with non-deterministic outputs, vulnerability to hallucinations (in LLMs), and a need for continual retraining.

---

### Q2. What is Forward Chaining, and why was it chosen over Backward Chaining?
**Answer:**  
**Forward Chaining** (data-driven reasoning) starts with known **facts in Working Memory** and matches them against the **premise (`IF` clause)** of rules in the Knowledge Base to derive new conclusions or actions.

- **Why chosen for SmartBook**:  
  In a book recommendation system, the user arrives with known facts (preferred genre, mood, experience, language, purpose) and seeks recommendations. Forward chaining naturally moves from **known user facts $\to$ matched rules $\to$ recommended candidate books**.
- **Backward Chaining** (goal-driven reasoning) is better suited for diagnostic systems (e.g., medical diagnosis or bug triage), where a specific hypothesis is proposed first and the system works backwards to find supporting evidence.

---

### Q3. What are the primary components of your AI architecture?
**Answer:**  
SmartBook consists of four core classical AI components:
1. **Knowledge Base (KB)**: Predefined collection of 20 domain rules (`rules.py`) capturing literary relationships.
2. **Working Memory (WM)**: Dynamic memory structure holding the user's asserted facts during an active session.
3. **Inference Engine**: Executes forward chaining pattern matching and enforces the language constraint filter.
4. **Explanation Facility (XAI)**: Traces which rules fired, explains why each book was chosen, and breaks down the numerical score.

---

### Q4. How is knowledge represented in SmartBook?
**Answer:**  
Knowledge is represented declaratively using **Production Rules** in structured Python dictionaries. Each rule contains:
- `rule_id`: Unique alphanumeric identifier (e.g., `RULE_01`).
- `conditions`: Key-value pairs defining the necessary premise (e.g., `{"genre": "Mystery", "mood": "Curious"}`).
- `action`: The prescriptive recommendation outcome.
- `weight`: The heuristic importance weight.
- `explanation`: Human-understandable rationale justifying why this rule exists.

---

### Q5. How does the weighted scoring algorithm work?
**Answer:**  
To rank candidate books that survive the mandatory filters, SmartBook evaluates each candidate book against user facts across 5 weighted dimensions:
- **Genre Match**: **40 points** (primary topic alignment)
- **Reading Mood Match**: **20 points** (emotional resonance)
- **Reading Purpose Match**: **15 points** (reader's end objective)
- **Reading Difficulty Match**: **15 points** (vocabulary and prose accessibility)
- **Page Length Match**: **10 points** (reading commitment: Short <200, Medium 200–400, Long >400)

**Total Maximum Score = 100 Points**.  
The result is presented as a **Rule Compatibility Score**, reflecting deterministic attribute overlap rather than a statistical probability.

---

### Q6. How do you prevent double-counting when multiple rules fire?
**Answer:**  
Double-counting is prevented by decoupling **rule evaluation** from **attribute point accumulation**.  
Each of the 5 attributes has a **fixed point ceiling** (40, 20, 15, 15, 10). If multiple rules relate to the same attribute (e.g., both a genre rule and an entertainment rule touch fiction), the genre attribute can only award its allocated 40 points once per book. This ensures no book can ever exceed 100 points.

---

### Q7. Why is Language treated as a mandatory filter rather than a weighted point?
**Answer:**  
Language is a **hard prerequisite constraint**, not a soft preference.  
If a user selects *Marathi*, recommending an English or Hindi book with an 85% match score would be completely unusable if the reader cannot read those languages. Therefore, language acts as a strict **pre-filtering constraint** before scoring begins.

---

### Q8. How does SmartBook handle the "Cold-Start Problem"?
**Answer:**  
In statistical and collaborative filtering recommender systems, the **cold-start problem** occurs when a new user has no prior reading history, making recommendations impossible without guessing.  
SmartBook completely eliminates the cold-start problem because it is **content- and rule-based**. The moment a first-time user answers the 6 questionnaire prompts, the system possesses complete working facts to execute immediate, high-quality forward chaining without needing historical logs.

---

### Q9. What is Explainable AI (XAI), and how is it demonstrated in this project?
**Answer:**  
**Explainable AI (XAI)** refers to artificial intelligence systems whose actions and outputs can be easily understood and trusted by human users, contrasting with "black box" models.  
In SmartBook, every single recommendation card provides:
1. Exact fired Rule IDs (e.g., `RULE_02`, `RULE_06`).
2. An **interactive points breakdown** showing exactly where each point was gained (+40 Genre, +20 Mood, etc.).
3. A natural-language sentence: *"Recommended because this book matches your Genre: Self-Help, Mood: Motivated, and Reading Level: Beginner."*
4. A dedicated **"How Our AI Made This Decision"** section exposing the inference telemetry.

---

### Q10. What is the time complexity of the recommendation algorithm?
**Answer:**  
Let:
- $R$ = Number of rules in the Knowledge Base (constant, 20).
- $B$ = Number of books in the language candidate pool ($N \le 54$).
- $A$ = Number of attribute checks per book (constant, 5).

- **Rule Matching**: $O(R)$ = $O(20) = O(1)$ constant time.
- **Candidate Evaluation**: $O(B \cdot A) = O(N)$.
- **Sorting**: $O(N \log N)$ using Python's Timsort.
- **Top 5 Slicing**: $O(k)$ where $k=5$.

Overall Time Complexity: **$O(N \log N)$**, which executes in under **10 milliseconds** on standard hardware, offering near-instantaneous response times.

---

### Q11. How does the system handle edge cases, such as unsupported languages?
**Answer:**  
If a user queries an unsupported language or an empty catalog subset:
1. The engine intercepts the zero-candidate pool post-language filter.
2. Rather than crashing or showing incorrect titles in a different language, it returns a status of `"warning"`.
3. The frontend displays a friendly guidance alert: *"No books currently available in [Language]. Please choose another language or add books in the Admin panel."*

---

### Q12. What security mechanisms protect the Admin Panel?
**Answer:**  
1. **Password Hashing**: Admin credentials in SQLite are hashed using `werkzeug.security.generate_password_hash` with modern salted hashes (scrypt/pbkdf2).
2. **Bearer Token Verification**: Admin mutations (`POST`, `PUT`, `DELETE /api/admin/books`) require an `Authorization: Bearer <token>` header, returning `401 Unauthorized` if invalid.
3. **Input Validation**: Backend routes strictly validate page bounds, non-empty title/author strings, and valid language sets.

---

### Q13. What testing methodologies were employed?
**Answer:**  
We built automated test suites with **Pytest**:
1. **Engine Unit Tests** (`test_recommendation.py`):
   - Page length bucket classification (<200, 200–400, >400).
   - Forward chaining rule activation verification.
   - Boundedness of scoring (asserting $0 \le \text{Score} \le 100$).
   - Strict language isolation tests for Hindi and Marathi.
   - Dynamic recommendation variation (ensuring different inputs produce different books).
2. **REST API Integration Tests** (`test_api.py`):
   - Catalog filtering endpoints (`/api/books`).
   - Preference payload validation (`/api/recommend`).
   - Knowledge base retrieval (`/api/rules`).
   - Admin authentication and CRUD lifecycle.

All 15 automated test cases pass with 100% success.

---

### Q14. What are the limitations of a pure rule-based recommendation system?
**Answer:**  
1. **Knowledge Acquisition Bottleneck**: Adding new genres or subtle sub-categories requires manual curation of new rules.
2. **Crisp Boundaries**: A book with 199 pages is classified as "Short", while 201 pages is "Medium" (binary thresholds).
3. **No Automatic Learning**: The system does not learn new literary trends on its own without rule updates.

---

### Q15. How would you improve this system for future work?
**Answer:**  
1. **Fuzzy Logic & Certainty Factors**: Introduce fuzzy membership functions for page length and mood compatibility rather than rigid boolean bounds.
2. **Hybrid Neuro-Symbolic Model**: Combine rule-based explainability with vector embeddings (e.g., SBERT) to match open-text reader descriptions with book blurbs while keeping deterministic rule audits.
3. **Dynamic Rule Authoring UI**: Expand the Admin panel to allow non-technical domain experts to create and activate new rules via a visual builder.
