import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  Cpu, 
  BookOpen, 
  LogOut, 
  CheckCircle2, 
  AlertCircle, 
  X, 
  Sparkles, 
  Layers, 
  RefreshCw,
  Eye,
  BarChart3
} from 'lucide-react';
import { 
  getBooks, 
  getRules, 
  getStats, 
  adminLogin, 
  getAdminToken, 
  clearAdminToken, 
  adminAddBook, 
  adminUpdateBook, 
  adminDeleteBook,
  getRecommendations 
} from '../services/api';

const INITIAL_BOOK_FORM = {
  title: '',
  author: '',
  genre: 'Fiction',
  description: '',
  language: 'English',
  pages: 250,
  reading_difficulty: 'Beginner',
  suitable_mood: 'Happy',
  reading_purpose: 'Entertainment',
  cover_image: '',
  rating: 4.5
};

const GENRES = [
  'Fiction', 'Mystery', 'Romance', 'Science Fiction',
  'Fantasy', 'Horror', 'Biography', 'Self-Help',
  'Technology', 'History'
];

const MOODS = ['Happy', 'Motivated', 'Curious', 'Emotional', 'Adventurous', 'Relaxed'];
const DIFFICULTIES = ['Beginner', 'Intermediate', 'Advanced'];
const LANGUAGES = ['English', 'Hindi', 'Marathi'];
const PURPOSES = ['Entertainment', 'Learning', 'Motivation', 'Knowledge', 'Personal Development'];

export default function AdminPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  // Dashboard state
  const [activeTab, setActiveTab] = useState('books'); // 'books', 'rules', 'simulator'
  const [books, setBooks] = useState([]);
  const [rules, setRules] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [bookForm, setBookForm] = useState(INITIAL_BOOK_FORM);
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');
  const [actionLoading, setActionLoading] = useState(false);

  // Simulator state
  const [simPrefs, setSimPrefs] = useState({
    genre: 'Self-Help',
    mood: 'Motivated',
    reading_difficulty: 'Beginner',
    preferred_length: 'Medium',
    language: 'English',
    reading_purpose: 'Motivation'
  });
  const [simResults, setSimResults] = useState(null);
  const [simLoading, setSimLoading] = useState(false);

  // Check initial token
  useEffect(() => {
    const token = getAdminToken();
    if (token) {
      setIsAuthenticated(true);
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [booksData, rulesData, statsData] = await Promise.all([
        getBooks(),
        getRules(),
        getStats()
      ]);
      setBooks(booksData.books || []);
      setRules(rulesData.rules || []);
      setStats(statsData || null);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginError('');
    setLoginLoading(true);
    try {
      await adminLogin(loginForm.username, loginForm.password);
      setIsAuthenticated(true);
      fetchDashboardData();
    } catch (err) {
      setLoginError(err.message || 'Invalid credentials. Default: admin / smartbook123');
    } finally {
      setLoginLoading(false);
    }
  };

  const handleLogout = () => {
    clearAdminToken();
    setIsAuthenticated(false);
    setLoginForm({ username: 'admin', password: '' });
  };

  const openAddModal = () => {
    setIsEditing(false);
    setEditingId(null);
    setBookForm(INITIAL_BOOK_FORM);
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const openEditModal = (book) => {
    setIsEditing(true);
    setEditingId(book.id);
    setBookForm({
      title: book.title,
      author: book.author,
      genre: book.genre,
      description: book.description,
      language: book.language,
      pages: book.pages,
      reading_difficulty: book.reading_difficulty,
      suitable_mood: book.suitable_mood,
      reading_purpose: book.reading_purpose,
      cover_image: book.cover_image,
      rating: book.rating || 4.5
    });
    setFormError('');
    setFormSuccess('');
    setIsModalOpen(true);
  };

  const handleSaveBook = async (e) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');
    setActionLoading(true);

    try {
      if (isEditing) {
        await adminUpdateBook(editingId, bookForm);
        setFormSuccess('Book updated successfully!');
      } else {
        await adminAddBook(bookForm);
        setFormSuccess('New book added successfully!');
      }
      await fetchDashboardData();
      setTimeout(() => {
        setIsModalOpen(false);
      }, 700);
    } catch (err) {
      setFormError(err.message || 'Operation failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteBook = async (bookId, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) {
      return;
    }
    try {
      await adminDeleteBook(bookId);
      await fetchDashboardData();
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    }
  };

  const handleRunSimulator = async () => {
    setSimLoading(true);
    try {
      const res = await getRecommendations(simPrefs, 3);
      setSimResults(res);
    } catch (err) {
      alert(`Simulation failed: ${err.message}`);
    } finally {
      setSimLoading(false);
    }
  };

  // Filtered books in admin table
  const filteredBooks = books.filter((b) => {
    if (!searchTerm) return true;
    const q = searchTerm.toLowerCase();
    return (
      (b.title || '').toLowerCase().includes(q) ||
      (b.author || '').toLowerCase().includes(q) ||
      (b.genre || '').toLowerCase().includes(q) ||
      (b.language || '').toLowerCase().includes(q)
    );
  });

  // ========================================================
  // LOGIN SCREEN (IF NOT AUTHENTICATED)
  // ========================================================
  if (!isAuthenticated) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md bg-white rounded-3xl border border-slate-200 shadow-xl p-8 animate-scaleUp">
          
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6" />
          </div>

          <h2 className="text-2xl font-bold text-center text-slate-900 tracking-tight">
            Admin Authentication
          </h2>
          <p className="text-xs text-center text-slate-500 mt-1 mb-6">
            Sign in to manage library inventory and inspect expert rules.
          </p>

          {loginError && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Username</label>
              <input
                type="text"
                value={loginForm.username}
                onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold text-slate-700 mb-1">Password</label>
              <input
                type="password"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                placeholder="Enter password..."
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 text-sm"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                {loginLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Authenticate Admin</span>
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Quick Viva Hint */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center text-[11px] text-slate-400">
            Demo Credentials: <span className="font-mono text-slate-600 font-bold">admin</span> / <span className="font-mono text-slate-600 font-bold">smartbook123</span>
          </div>

        </div>
      </div>
    );
  }

  // ========================================================
  // AUTHENTICATED DASHBOARD
  // ========================================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Top Banner & Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Admin Control Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Library Catalog & <span className="text-gradient">Rule Inspector</span>
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-slate-500">
            Authenticated administrator session • Full CRUD permissions on books and rule evaluation.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchDashboardData}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 transition-colors"
            title="Refresh data"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-rose-50 hover:text-rose-600 text-slate-700 text-xs font-semibold transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Row */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Total Books</div>
            <div className="text-2xl font-black text-slate-900 mt-1">{stats.total_books}</div>
            <div className="text-[11px] text-slate-500 mt-1">Active in SQLite DB</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Active Rules</div>
            <div className="text-2xl font-black text-brand-600 mt-1">{stats.total_rules}</div>
            <div className="text-[11px] text-slate-500 mt-1">Knowledge base rules</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Languages</div>
            <div className="text-2xl font-black text-indigo-600 mt-1">
              {stats.language_distribution ? Object.keys(stats.language_distribution).length : 3}
            </div>
            <div className="text-[11px] text-slate-500 mt-1">EN, HI, MR Editions</div>
          </div>
          <div className="p-5 rounded-2xl bg-white border border-slate-200 shadow-xs">
            <div className="text-xs text-slate-400 font-medium uppercase tracking-wider">Engine Status</div>
            <div className="text-2xl font-black text-emerald-600 mt-1">Healthy</div>
            <div className="text-[11px] text-slate-500 mt-1">&lt; 10ms Inference</div>
          </div>
        </div>
      )}

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-slate-200 text-xs font-bold">
        <button
          onClick={() => setActiveTab('books')}
          className={`flex items-center gap-2 pb-3 px-3 transition-colors border-b-2 ${
            activeTab === 'books'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Book Inventory ({books.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('rules')}
          className={`flex items-center gap-2 pb-3 px-3 transition-colors border-b-2 ${
            activeTab === 'rules'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Cpu className="w-4 h-4" />
          <span>Knowledge Rules ({rules.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('simulator')}
          className={`flex items-center gap-2 pb-3 px-3 transition-colors border-b-2 ${
            activeTab === 'simulator'
              ? 'border-indigo-600 text-indigo-600'
              : 'border-transparent text-slate-500 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Quick Recommendation Simulator</span>
        </button>
      </div>

      {/* ======================================================== */}
      {/* TAB 1: BOOK INVENTORY (CRUD TABLE)                       */}
      {/* ======================================================== */}
      {activeTab === 'books' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search inventory..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-slate-200 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <button
              onClick={openAddModal}
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Book</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Book</th>
                    <th className="py-3 px-4">Genre</th>
                    <th className="py-3 px-4">Language</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4">Pages</th>
                    <th className="py-3 px-4">Rating</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredBooks.map((book) => (
                    <tr key={book.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={book.cover_image}
                            alt=""
                            className="w-8 h-11 object-cover rounded bg-slate-100 shrink-0"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                            }}
                          />
                          <div>
                            <div className="font-bold text-slate-900 line-clamp-1">{book.title}</div>
                            <div className="text-[11px] text-slate-500">{book.author}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {book.genre}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-700">{book.language}</span>
                      </td>
                      <td className="py-3 px-4 text-slate-600">{book.reading_difficulty}</td>
                      <td className="py-3 px-4 text-slate-600">{book.pages}</td>
                      <td className="py-3 px-4 font-bold text-slate-800">
                        ⭐ {book.rating ? Number(book.rating).toFixed(1) : '4.8'}
                      </td>
                      <td className="py-3 px-4 text-right space-x-2">
                        <button
                          onClick={() => openEditModal(book)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                          title="Edit Book"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteBook(book.id, book.title)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                          title="Delete Book"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {filteredBooks.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-500">
                No matching books found in inventory.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 2: KNOWLEDGE BASE RULES                              */}
      {/* ======================================================== */}
      {activeTab === 'rules' && (
        <div className="space-y-4">
          <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-100 text-xs text-indigo-900 leading-relaxed">
            <strong>Rule-Based AI Architecture:</strong> These rules represent domain knowledge formulated as deterministic IF–THEN implications. During evaluation, user preference facts are verified against the condition premises.
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {rules.map((rule) => (
              <div key={rule.rule_id} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                    {rule.rule_id}
                  </span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    Active
                  </span>
                </div>

                <h4 className="font-bold text-sm text-slate-900">{rule.name}</h4>

                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-[11px]">
                  <span className="font-bold text-indigo-600">IF (CONDITIONS): </span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {Object.entries(rule.conditions || {}).map(([k, v]) => (
                      <span key={k} className="px-1.5 py-0.5 rounded bg-white border border-slate-200 font-mono text-[10px]">
                        {k}: <strong>{v}</strong>
                      </span>
                    ))}
                  </div>
                </div>

                <div className="text-xs text-slate-700">
                  <span className="font-bold text-brand-600">THEN: </span>
                  {rule.action}
                </div>

                <div className="text-[11px] text-slate-500 italic pt-1 border-t border-slate-100">
                  "{rule.explanation}"
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* TAB 3: QUICK RECOMMENDATION SIMULATOR                    */}
      {/* ======================================================== */}
      {activeTab === 'simulator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Simulator Inputs */}
          <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>Simulate User Preferences</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Genre</label>
                <select
                  value={simPrefs.genre}
                  onChange={(e) => setSimPrefs({ ...simPrefs, genre: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mood</label>
                <select
                  value={simPrefs.mood}
                  onChange={(e) => setSimPrefs({ ...simPrefs, mood: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Difficulty</label>
                <select
                  value={simPrefs.reading_difficulty}
                  onChange={(e) => setSimPrefs({ ...simPrefs, reading_difficulty: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Length</label>
                <select
                  value={simPrefs.preferred_length}
                  onChange={(e) => setSimPrefs({ ...simPrefs, preferred_length: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <option value="Short">Short (&lt;200)</option>
                  <option value="Medium">Medium (200-400)</option>
                  <option value="Long">Long (&gt;400)</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Language</label>
                <select
                  value={simPrefs.language}
                  onChange={(e) => setSimPrefs({ ...simPrefs, language: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Purpose</label>
                <select
                  value={simPrefs.reading_purpose}
                  onChange={(e) => setSimPrefs({ ...simPrefs, reading_purpose: e.target.value })}
                  className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              <button
                onClick={handleRunSimulator}
                disabled={simLoading}
                className="w-full mt-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center justify-center gap-2"
              >
                {simLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <Cpu className="w-4 h-4" />
                    <span>Run Inference Simulation</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Simulation Output */}
          <div className="lg:col-span-7 bg-white p-6 rounded-3xl border border-slate-200">
            <h3 className="font-bold text-base text-slate-900 mb-3 flex items-center justify-between">
              <span>Simulation Inference Output</span>
              {simResults && (
                <span className="text-xs text-indigo-600 font-semibold">
                  {simResults.total_rules_fired} Rules Fired
                </span>
              )}
            </h3>

            {!simResults && (
              <div className="p-12 text-center text-xs text-slate-400">
                Click "Run Inference Simulation" to inspect forward-chaining rules and ranked candidate books.
              </div>
            )}

            {simResults && (
              <div className="space-y-4 text-xs">
                {/* Fired Rules */}
                <div>
                  <span className="font-bold text-slate-700 block mb-1">Matched Rule IDs:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {simResults.matched_rules.map((r) => (
                      <span key={r.rule_id} className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 font-mono font-bold border border-indigo-200">
                        {r.rule_id}: {r.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Candidate Results */}
                <div className="space-y-2 pt-2 border-t border-slate-100">
                  <span className="font-bold text-slate-700 block">Top Ranked Books:</span>
                  {simResults.recommendations.map((b, i) => (
                    <div key={b.id} className="p-3 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                      <div>
                        <div className="font-bold text-slate-900">#{i + 1} {b.title} ({b.author})</div>
                        <div className="text-[11px] text-slate-500">{b.explanation}</div>
                      </div>
                      <div className="text-right shrink-0 ml-3">
                        <div className="text-sm font-extrabold text-indigo-600">{b.compatibility_score}%</div>
                        <div className="text-[10px] text-slate-400">Score</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* ADD / EDIT BOOK MODAL                                    */}
      {/* ======================================================== */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 max-h-[90vh] overflow-y-auto">
            
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">
                {isEditing ? 'Edit Book Record' : 'Add New Book to Inventory'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                {formError}
              </div>
            )}

            {formSuccess && (
              <div className="mt-4 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium">
                {formSuccess}
              </div>
            )}

            <form onSubmit={handleSaveBook} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Book Title *</label>
                  <input
                    type="text"
                    value={bookForm.title}
                    onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                    required
                    placeholder="e.g., Clean Architecture"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Author *</label>
                  <input
                    type="text"
                    value={bookForm.author}
                    onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                    required
                    placeholder="e.g., Robert C. Martin"
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Genre *</label>
                  <select
                    value={bookForm.genre}
                    onChange={(e) => setBookForm({ ...bookForm, genre: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  >
                    {GENRES.map((g) => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Language *</label>
                  <select
                    value={bookForm.language}
                    onChange={(e) => setBookForm({ ...bookForm, language: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  >
                    {LANGUAGES.map((l) => <option key={l} value={l}>{l}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Difficulty *</label>
                  <select
                    value={bookForm.reading_difficulty}
                    onChange={(e) => setBookForm({ ...bookForm, reading_difficulty: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  >
                    {DIFFICULTIES.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Suitable Mood *</label>
                  <select
                    value={bookForm.suitable_mood}
                    onChange={(e) => setBookForm({ ...bookForm, suitable_mood: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  >
                    {MOODS.map((m) => <option key={m} value={m}>{m}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Reading Purpose *</label>
                  <select
                    value={bookForm.reading_purpose}
                    onChange={(e) => setBookForm({ ...bookForm, reading_purpose: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  >
                    {PURPOSES.map((p) => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pages *</label>
                  <input
                    type="number"
                    value={bookForm.pages}
                    onChange={(e) => setBookForm({ ...bookForm, pages: parseInt(e.target.value) || 0 })}
                    required
                    className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Cover Image URL *</label>
                <input
                  type="url"
                  value={bookForm.cover_image}
                  onChange={(e) => setBookForm({ ...bookForm, cover_image: e.target.value })}
                  required
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Description / Synopsis *</label>
                <textarea
                  rows={3}
                  value={bookForm.description}
                  onChange={(e) => setBookForm({ ...bookForm, description: e.target.value })}
                  required
                  placeholder="Summary of the book..."
                  className="w-full p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-md shadow-indigo-500/20"
                >
                  {actionLoading ? 'Saving...' : isEditing ? 'Update Book' : 'Add Book'}
                </button>
              </div>
            </form>

          </div>
        </div>
      )}

    </div>
  );
}
