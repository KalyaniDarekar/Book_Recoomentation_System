import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Compass, 
  Cpu, 
  CheckCircle2, 
  BookOpen, 
  ArrowRight, 
  Layers, 
  Award, 
  Zap, 
  ShieldCheck, 
  BarChart3,
  HelpCircle
} from 'lucide-react';
import { getBooks, getStats } from '../services/api';
import BookCard from '../components/BookCard';
import BookDetailsModal from '../components/BookDetailsModal';

export default function HomePage() {
  const [featuredBooks, setFeaturedBooks] = useState([]);
  const [selectedBook, setSelectedBook] = useState(null);
  const [activeTab, setActiveTab] = useState('All');
  const [stats, setStats] = useState({ total_books: 54, total_rules: 20 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch initial books & stats
    Promise.all([getBooks(), getStats()])
      .then(([booksData, statsData]) => {
        setFeaturedBooks(booksData.books || []);
        if (statsData) setStats(statsData);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching home data:', err);
        setLoading(false);
      });
  }, []);

  const filteredFeatured = featuredBooks.filter((book) => {
    if (activeTab === 'All') return true;
    return book.language === activeTab;
  }).slice(0, 8);

  return (
    <div className="space-y-20 pb-16">
      
      {/* ======================================================== */}
      {/* 1. HERO SECTION                                          */}
      {/* ======================================================== */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28 bg-radial-glow border-b border-slate-200/60">
        
        {/* Subtle Decorative Elements */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-400/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-1/3 right-10 w-72 h-72 bg-brand-400/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          
          {/* Viva / Academic Project Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white shadow-sm border border-indigo-100 text-indigo-700 text-xs font-semibold mb-6 animate-fadeIn">
            <span className="flex h-2 w-2 rounded-full bg-indigo-600 animate-pulse"></span>
            <span>AI Mini Project • Rule-Based Expert System</span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-500 font-normal">Computer Engineering</span>
          </div>

          {/* Main Hero Headings */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight leading-[1.1] max-w-4xl mx-auto">
            Discover Your Next <br />
            <span className="text-gradient">Favorite Book</span>
          </h1>

          <p className="mt-6 text-base sm:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Get personalized book recommendations based on your interests, mood, and reading preferences using an Explainable AI rule engine.
          </p>

          {/* Action Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/recommend"
              className="w-full sm:w-auto flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-700 to-brand-600 text-white font-bold text-base shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/35 hover:scale-[1.03] active:scale-[0.98] transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>Get Recommendations</span>
              <ArrowRight className="w-4 h-4 ml-1" />
            </Link>

            <Link
              to="/explore"
              className="w-full sm:w-auto flex items-center justify-center gap-2 px-8 py-4 rounded-2xl bg-white border border-slate-200/90 text-slate-700 font-bold text-base hover:bg-slate-50 hover:border-slate-300 shadow-sm transition-all"
            >
              <Compass className="w-5 h-5 text-indigo-600" />
              <span>Explore Books</span>
            </Link>
          </div>

          {/* Metric Highlights Strip */}
          <div className="mt-14 pt-8 border-t border-slate-200/80 max-w-3xl mx-auto grid grid-cols-2 sm:grid-cols-4 gap-6 text-center">
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">{stats.total_books || 54}+</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Curated Books</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-brand-600">{stats.total_rules || 20}</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Predefined IF–THEN Rules</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-indigo-600">3</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Languages (EN/HI/MR)</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">100%</div>
              <div className="text-xs font-medium text-slate-500 mt-0.5">Explainable AI (XAI)</div>
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 2. HOW IT WORKS (3-STEP PIPELINE)                        */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-3">
            <Zap className="w-3.5 h-3.5" />
            <span>AI Inference Flow</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            How Our <span className="text-gradient">Rule-Based AI</span> Works
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base">
            Unlike unpredictable black-box neural networks, our system applies strict deterministic forward-chaining logic that can be inspected and verified.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Step 1 */}
          <div className="relative p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
              01
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">1. Input Preferences</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Answer 6 quick questions covering your preferred Genre, current Reading Mood, Experience level, Book Length, Language, and Purpose.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-indigo-600 font-semibold flex items-center gap-1">
              <span>Working Memory Facts</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-110 group-hover:bg-brand-600 group-hover:text-white transition-all">
              02
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">2. Forward Chaining</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              The AI inference engine evaluates 20 predefined IF–THEN rules against your facts and applies strict mandatory language filtering.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-brand-600 font-semibold flex items-center gap-1">
              <span>Rule Matching & Filtering</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative p-8 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-lg transition-all group">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-110 group-hover:bg-emerald-600 group-hover:text-white transition-all">
              03
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">3. Weighted Ranking & XAI</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              Matching candidates receive a compatibility score (0–100) based on weighted parameters, returning the Top 5 with full decision explanations.
            </p>
            <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-emerald-600 font-semibold flex items-center gap-1">
              <span>Transparent Decision Trace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. FEATURED BOOKS SHOWCASE                               */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-2">
              <BookOpen className="w-3.5 h-3.5" />
              <span>Handpicked Catalog</span>
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
              Featured Books Across Languages
            </h2>
            <p className="text-sm text-slate-600 mt-1">
              Browse authentic titles in English, Hindi, and Marathi with accurate edition metadata.
            </p>
          </div>

          {/* Language Tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/90 rounded-2xl border border-slate-200 text-xs font-semibold">
            {['All', 'English', 'Hindi', 'Marathi'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded-xl transition-all ${
                  activeTab === tab
                    ? 'bg-white text-indigo-700 shadow-sm'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Book Grid */}
        {loading ? (
          <div className="p-16 text-center text-slate-500">
            <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
            Loading library books...
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-5">
            {filteredFeatured.map((book) => (
              <BookCard key={book.id} book={book} onSelect={setSelectedBook} />
            ))}
          </div>
        )}

        {/* View Full Catalog Link */}
        <div className="mt-10 text-center">
          <Link
            to="/explore"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold transition-colors"
          >
            <Compass className="w-4 h-4 text-indigo-600" />
            <span>Explore All {featuredBooks.length} Books in Library Catalog</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. VIVA DEFENSE & AI ARCHITECTURE COMPARISON             */}
      {/* ======================================================== */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-br from-indigo-900 via-slate-900 to-brand-950 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
            
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold mb-4">
                <Award className="w-3.5 h-3.5" />
                <span>Viva Examination Highlights</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold tracking-tight leading-snug">
                Why a Rule-Based Expert System for Book Recommendation?
              </h3>
              <p className="mt-4 text-sm text-slate-300 leading-relaxed">
                Traditional Machine Learning and LLMs function as probabilistic black boxes that often suffer from hallucinated recommendations and lack verifiable explanations.
              </p>

              <div className="mt-6 space-y-3 text-xs sm:text-sm">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">100% Deterministic & Auditable:</span> Same inputs always trigger identical rules and yield consistent rankings.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Explainable AI (XAI):</span> Every suggested title exposes the exact rule IDs, conditions, and points that triggered it.
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-white">Zero External APIs / Zero Training Latency:</span> Runs self-contained with immediate forward-chaining inference in &lt;10ms.
                  </div>
                </div>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/rules"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-slate-900 font-semibold text-xs hover:bg-slate-100 transition-colors"
                >
                  <Cpu className="w-4 h-4 text-indigo-600" />
                  <span>Inspect All 20 Predefined Rules</span>
                </Link>
              </div>
            </div>

            {/* Right Card: Scoring Weights Demonstration */}
            <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/10 space-y-4">
              <h4 className="font-bold text-sm tracking-wide text-indigo-200 uppercase flex items-center justify-between">
                <span>Weighted Scoring Formula</span>
                <span className="text-xs text-slate-400 font-normal">Max: 100 Pts</span>
              </h4>

              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Genre Match</span>
                    <span className="text-indigo-300">40 Points (40%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-[40%] h-full bg-indigo-400 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Reading Mood Match</span>
                    <span className="text-brand-300">20 Points (20%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-[20%] h-full bg-brand-400 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Reading Purpose Match</span>
                    <span className="text-cyan-300">15 Points (15%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-[15%] h-full bg-cyan-400 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Reading Difficulty / Experience</span>
                    <span className="text-emerald-300">15 Points (15%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-[15%] h-full bg-emerald-400 rounded-full"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between font-semibold mb-1">
                    <span>Book Length (Page Bucket)</span>
                    <span className="text-amber-300">10 Points (10%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
                    <div className="w-[10%] h-full bg-amber-400 rounded-full"></div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-white/10 text-[11px] text-slate-300 flex items-center justify-between">
                <span>Mandatory Constraint:</span>
                <span className="font-semibold text-emerald-400">Strict Language Filter</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. CALL TO ACTION BANNER                                 */}
      {/* ======================================================== */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="p-10 rounded-3xl bg-gradient-to-r from-indigo-50 to-brand-50 border border-indigo-100 shadow-sm">
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Ready to Discover Your Next Read?
          </h2>
          <p className="mt-3 text-slate-600 text-sm max-w-xl mx-auto">
            Take 60 seconds to answer our interactive reading questionnaire and watch our forward-chaining expert system tailor the ideal books for you.
          </p>
          <div className="mt-6 flex justify-center">
            <Link
              to="/recommend"
              className="flex items-center gap-2 px-8 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 to-brand-600 text-white font-bold text-sm shadow-md shadow-indigo-500/20 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-4 h-4" />
              <span>Start Preference Questionnaire</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Book Details Modal */}
      {selectedBook && (
        <BookDetailsModal
          book={selectedBook}
          onClose={() => setSelectedBook(null)}
        />
      )}

    </div>
  );
}
