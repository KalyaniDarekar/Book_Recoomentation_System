import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  RotateCcw, 
  Compass, 
  Printer, 
  Star, 
  BookOpen, 
  CheckCircle2, 
  Layers, 
  Globe2, 
  ArrowRight, 
  AlertCircle,
  HelpCircle,
  Award,
  ChevronDown,
  ChevronUp,
  Share2
} from 'lucide-react';
import ExplainableAISection from '../components/ExplainableAISection';
import BookDetailsModal from '../components/BookDetailsModal';

export default function ResultsPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const [results, setResults] = useState(null);
  const [preferences, setPreferences] = useState(null);
  const [selectedBook, setSelectedBook] = useState(null);
  const [expandedBreakdown, setExpandedBreakdown] = useState({});

  useEffect(() => {
    // 1. Try reading from Router location.state
    if (location.state?.results && location.state?.preferences) {
      setResults(location.state.results);
      setPreferences(location.state.preferences);
    } else {
      // 2. Fallback to sessionStorage
      const savedResults = sessionStorage.getItem('smartbook_last_results');
      const savedPrefs = sessionStorage.getItem('smartbook_last_prefs');
      if (savedResults && savedPrefs) {
        try {
          setResults(JSON.parse(savedResults));
          setPreferences(JSON.parse(savedPrefs));
        } catch (e) {
          console.error('Error parsing cached recommendation results:', e);
        }
      }
    }
  }, [location.state]);

  const toggleBreakdown = (bookId) => {
    setExpandedBreakdown((prev) => ({
      ...prev,
      [bookId]: !prev[bookId]
    }));
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-indigo-600 bg-indigo-50 border-indigo-200';
    return 'text-amber-600 bg-amber-50 border-amber-200';
  };

  const getScoreBarGradient = (score) => {
    if (score >= 80) return 'from-emerald-500 to-teal-600';
    if (score >= 60) return 'from-indigo-600 to-brand-600';
    return 'from-amber-500 to-orange-600';
  };

  // If no recommendation data exists yet
  if (!results) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 rounded-3xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4 border border-indigo-100 shadow-sm">
          <BookOpen className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900">No Recommendation Session Found</h2>
        <p className="text-sm text-slate-500 mt-2 max-w-md mx-auto">
          Please complete our 60-second reading preference questionnaire to generate your rule-based recommendations.
        </p>
        <Link
          to="/recommend"
          className="mt-6 inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-sm shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
        >
          <Sparkles className="w-4 h-4" />
          <span>Start Preference Questionnaire</span>
        </Link>
      </div>
    );
  }

  const recommendations = results.recommendations || [];
  const isWarning = results.status === 'warning';

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-12">
      
      {/* ======================================================== */}
      {/* 1. TOP HEADER & SUMMARY PILLS                            */}
      {/* ======================================================== */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200/80">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-semibold mb-2">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>AI Reasoning Complete</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Your Personalized <span className="text-gradient">Book Recommendations</span>
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-600">
            Top {recommendations.length} books selected using forward-chaining rules and weighted attribute ranking.
          </p>

          {/* Active Preference Chips */}
          <div className="flex flex-wrap items-center gap-1.5 mt-3">
            <span className="text-xs font-semibold text-slate-500 mr-1">Your Profile:</span>
            {preferences && Object.entries(preferences).map(([key, val]) => (
              val && (
                <span
                  key={key}
                  className="px-2.5 py-0.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200"
                >
                  <span className="text-slate-400 capitalize">{key.replace('_', ' ')}:</span>{' '}
                  <span className="font-semibold text-slate-900">{val}</span>
                </span>
              )
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 shadow-sm transition-all"
            title="Print or save as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-slate-500" />
            <span>Print Report</span>
          </button>

          <Link
            to="/recommend"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold hover:bg-indigo-100 transition-all"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Try Again</span>
          </Link>
        </div>
      </div>

      {/* ======================================================== */}
      {/* 2. WARNING / NO MATCH STATE (IF ANY)                     */}
      {/* ======================================================== */}
      {isWarning && (
        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-200 text-amber-900 space-y-3">
          <div className="flex items-center gap-2.5 font-bold text-base">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            <span>Notice: {results.message}</span>
          </div>
          <p className="text-xs text-amber-800 leading-relaxed">
            Our mandatory language constraint strictly prevents cross-language mismatch. Please select another language (such as English, Hindi, or Marathi) or explore all available titles.
          </p>
          <div className="flex gap-3 pt-2">
            <Link
              to="/recommend"
              className="px-4 py-2 rounded-xl bg-amber-600 text-white text-xs font-bold shadow-sm"
            >
              Adjust Language
            </Link>
            <Link
              to="/explore"
              className="px-4 py-2 rounded-xl bg-white border border-amber-300 text-amber-800 text-xs font-bold"
            >
              Explore Catalog
            </Link>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 3. TOP 5 RECOMMENDED BOOKS LIST                          */}
      {/* ======================================================== */}
      {!isWarning && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-indigo-600" />
              <span>Top 5 Ranked Recommendations</span>
            </h2>
            <span className="text-xs text-slate-500">
              Sorted by Rule Compatibility Score
            </span>
          </div>

          <div className="space-y-5">
            {recommendations.map((book, index) => {
              const score = book.compatibility_score || 0;
              const breakdown = book.score_breakdown || {};
              const isDetailsOpen = !!expandedBreakdown[book.id];

              return (
                <div
                  key={book.id}
                  className="p-5 sm:p-6 rounded-3xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-all relative overflow-hidden"
                >
                  {/* Rank Ribbon */}
                  <div className="absolute top-0 left-0 bg-indigo-600 text-white text-[11px] font-black px-3.5 py-1 rounded-br-2xl shadow-sm">
                    #{index + 1} Best Match
                  </div>

                  <div className="pt-4 grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                    
                    {/* Book Cover */}
                    <div className="md:col-span-2 flex justify-center">
                      <div className="w-28 h-40 rounded-xl overflow-hidden shadow-md border-2 border-white bg-slate-100 shrink-0">
                        <img
                          src={book.cover_image}
                          alt={book.title}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                          }}
                        />
                      </div>
                    </div>

                    {/* Book Metadata & Reason */}
                    <div className="md:col-span-7 space-y-2.5">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                          {book.genre}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                          {book.language}
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500 font-medium">
                          {book.reading_difficulty} Level
                        </span>
                        <span className="text-xs text-slate-400">•</span>
                        <span className="text-xs text-slate-500">
                          {book.pages} pages
                        </span>
                      </div>

                      <h3 className="text-xl font-bold text-slate-900 tracking-tight leading-snug">
                        {book.title}
                      </h3>
                      
                      <p className="text-xs text-slate-500 font-medium">
                        By <span className="text-slate-800 font-semibold">{book.author}</span>
                      </p>

                      <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                        {book.description}
                      </p>

                      {/* "Why This Book Was Recommended" Badge */}
                      <div className="p-3 rounded-2xl bg-indigo-50/70 border border-indigo-100/90 text-xs text-indigo-950 flex items-start gap-2">
                        <Sparkles className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-indigo-900">Why recommended: </span>
                          <span>{book.explanation}</span>
                        </div>
                      </div>

                      {/* Triggered Rule Chips */}
                      {book.matched_rule_ids && book.matched_rule_ids.length > 0 && (
                        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                          <span className="text-slate-400">Triggered Rules:</span>
                          {book.matched_rule_ids.map((rId) => (
                            <span
                              key={rId}
                              className="px-2 py-0.5 rounded-md bg-white border border-indigo-200 text-indigo-700 font-mono font-bold text-[10px]"
                            >
                              {rId}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>

                    {/* Compatibility Score & Actions */}
                    <div className="md:col-span-3 flex flex-col items-center sm:items-end justify-center gap-3 pt-3 md:pt-0 border-t md:border-t-0 border-slate-100">
                      
                      {/* Compatibility Score Display */}
                      <div className="text-center sm:text-right w-full">
                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                          Rule Compatibility Score
                        </div>
                        <div className="flex items-baseline justify-center sm:justify-end gap-1">
                          <span className="text-3xl font-extrabold text-slate-900 tracking-tight">
                            {score}%
                          </span>
                          <span className="text-xs text-slate-400 font-semibold">Match</span>
                        </div>

                        {/* Progress Bar */}
                        <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden mt-1.5">
                          <div
                            className={`h-full bg-gradient-to-r ${getScoreBarGradient(score)} rounded-full`}
                            style={{ width: `${score}%` }}
                          ></div>
                        </div>

                        <span className="text-[10px] text-slate-400 block mt-1">
                          Deterministic Multi-Rule Weight
                        </span>
                      </div>

                      {/* Score Breakdown Toggle */}
                      <button
                        onClick={() => toggleBreakdown(book.id)}
                        className="text-[11px] font-semibold text-indigo-600 hover:text-indigo-800 flex items-center gap-1 transition-colors"
                      >
                        <span>{isDetailsOpen ? 'Hide points' : 'View points breakdown'}</span>
                        {isDetailsOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                      </button>

                      {/* View Details Modal Trigger */}
                      <button
                        onClick={() => setSelectedBook(book)}
                        className="w-full py-2.5 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-sm transition-all text-center"
                      >
                        View Full Details
                      </button>
                    </div>

                  </div>

                  {/* Expandable Score Breakdown Accordion */}
                  {isDetailsOpen && (
                    <div className="mt-4 pt-4 border-t border-slate-100 bg-slate-50 -mx-5 -mb-5 sm:-mx-6 sm:-mb-6 p-4 rounded-b-3xl text-xs space-y-2 animate-fadeIn">
                      <div className="font-bold text-slate-700 mb-1 flex items-center justify-between">
                        <span>Points Contributed by Attributes (Total: {score}/100 pts):</span>
                        <span className="text-[10px] text-slate-400 font-normal">Formula verified</span>
                      </div>

                      <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center text-[11px]">
                        <div className="p-2 rounded-xl bg-white border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">Genre (40)</span>
                          <span className="font-bold text-indigo-600">+{breakdown.genre_match || 0} pts</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">Mood (20)</span>
                          <span className="font-bold text-brand-600">+{breakdown.mood_match || 0} pts</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">Purpose (15)</span>
                          <span className="font-bold text-cyan-600">+{breakdown.purpose_match || 0} pts</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">Difficulty (15)</span>
                          <span className="font-bold text-emerald-600">+{breakdown.difficulty_match || 0} pts</span>
                        </div>
                        <div className="p-2 rounded-xl bg-white border border-slate-200">
                          <span className="text-slate-400 block text-[10px]">Length (10)</span>
                          <span className="font-bold text-amber-600">+{breakdown.length_match || 0} pts</span>
                        </div>
                      </div>
                    </div>
                  )}

                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* 4. EXPLAINABLE AI SECTION (TRANSPARENCY & VIVA DEFENSE)  */}
      {/* ======================================================== */}
      <section>
        <ExplainableAISection
          results={results}
          userPreferences={preferences}
        />
      </section>

      {/* ======================================================== */}
      {/* 5. BOTTOM NAVIGATION ACTIONS                             */}
      {/* ======================================================== */}
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4 border-t border-slate-200">
        <Link
          to="/recommend"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold shadow-md shadow-indigo-500/20 transition-all hover:scale-105"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Try Another Reading Profile</span>
        </Link>

        <Link
          to="/explore"
          className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-white border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-50 transition-all"
        >
          <Compass className="w-4 h-4 text-indigo-600" />
          <span>Explore All 54 Books in Library</span>
        </Link>
      </div>

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
