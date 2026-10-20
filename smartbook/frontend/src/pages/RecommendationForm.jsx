import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  RotateCcw, 
  Cpu, 
  BookOpen, 
  Heart, 
  Search, 
  Rocket, 
  Ghost, 
  User, 
  TrendingUp, 
  Code2, 
  Landmark, 
  Smile, 
  Flame, 
  Lightbulb, 
  Coffee, 
  Compass, 
  Sprout, 
  GraduationCap, 
  BookMarked, 
  Layers, 
  Globe2, 
  Languages, 
  Target, 
  Library,
  Zap,
  Check
} from 'lucide-react';
import { getRecommendations } from '../services/api';

const QUESTIONS = [
  {
    id: 'genre',
    title: 'Question 1: What is your favorite genre?',
    subtitle: 'Select the literary category that excites you the most.',
    options: [
      { value: 'Fiction', label: 'Fiction', desc: 'Imaginative narratives and character journeys', icon: BookOpen },
      { value: 'Mystery', label: 'Mystery', desc: 'Detective inquiries and suspenseful whodunits', icon: Search },
      { value: 'Romance', label: 'Romance', desc: 'Heartfelt human bonds and emotional love stories', icon: Heart },
      { value: 'Science Fiction', label: 'Science Fiction', desc: 'Futuristic ideas, cosmos, and speculative tech', icon: Rocket },
      { value: 'Fantasy', label: 'Fantasy', desc: 'Mythical world-building, magic, and epic quests', icon: Sparkles },
      { value: 'Horror', label: 'Horror', desc: 'Psychological suspense, dread, and supernatural tales', icon: Ghost },
      { value: 'Biography', label: 'Biography', desc: 'Real memoirs and extraordinary life stories', icon: User },
      { value: 'Self-Help', label: 'Self-Help', desc: 'Habits, mindset growth, and productivity', icon: TrendingUp },
      { value: 'Technology', label: 'Technology', desc: 'Software craftsmanship, architecture, and coding', icon: Code2 },
      { value: 'History', label: 'History', desc: 'Civilizations, epochal wars, and cultural evolution', icon: Landmark },
    ]
  },
  {
    id: 'mood',
    title: 'Question 2: What is your current reading mood?',
    subtitle: 'How do you want to feel while turning the pages?',
    options: [
      { value: 'Happy', label: 'Happy', desc: 'Uplifting, humorous, and heartwarming', icon: Smile },
      { value: 'Motivated', label: 'Motivated', desc: 'Driven, ambitious, and ready to take action', icon: Flame },
      { value: 'Curious', label: 'Curious', desc: 'Inquisitive, analytical, and eager to discover', icon: Lightbulb },
      { value: 'Emotional', label: 'Emotional', desc: 'Deeply moving, poignant, and heartfelt', icon: Heart },
      { value: 'Adventurous', label: 'Adventurous', desc: 'Craving bold thrills, journeys, and high stakes', icon: Compass },
      { value: 'Relaxed', label: 'Relaxed', desc: 'Gentle, comforting, and peaceful decompression', icon: Coffee },
    ]
  },
  {
    id: 'reading_difficulty',
    title: 'Question 3: What is your reading experience?',
    subtitle: 'This adjusts language complexity and prose density.',
    options: [
      { value: 'Beginner', label: 'Beginner', desc: 'Approachable, lucid prose with effortless flow', icon: Sprout },
      { value: 'Intermediate', label: 'Intermediate', desc: 'Balanced depth, nuanced vocabulary, and pacing', icon: BookMarked },
      { value: 'Advanced', label: 'Advanced', desc: 'Dense, multi-layered philosophical or technical prose', icon: GraduationCap },
    ]
  },
  {
    id: 'preferred_length',
    title: 'Question 4: What book length do you prefer?',
    subtitle: 'Choose your ideal reading commitment.',
    options: [
      { value: 'Short', label: 'Short (Below 200 pages)', desc: 'Quick weekend or commute reads under 200 pages', icon: Zap },
      { value: 'Medium', label: 'Medium (200–400 pages)', desc: 'Standard novel or book digest (200 to 400 pages)', icon: BookOpen },
      { value: 'Long', label: 'Long (Above 400 pages)', desc: 'Expansive, immersive tomes exceeding 400 pages', icon: Layers },
    ]
  },
  {
    id: 'language',
    title: 'Question 5: What is your preferred language?',
    subtitle: 'Enforces a strict mandatory filter on authentic editions.',
    options: [
      { value: 'English', label: 'English', desc: 'Global bestsellers and world literary classics', icon: Globe2 },
      { value: 'Hindi', label: 'Hindi (हिंदी)', desc: 'Masterpieces by Premchand, Dinkar, Bachchan, etc.', icon: Languages },
      { value: 'Marathi', label: 'Marathi (मराठी)', desc: 'Timeless classics by Shivaji Sawant, Pu La, Sane Guruji', icon: BookOpen },
    ]
  },
  {
    id: 'reading_purpose',
    title: 'Question 6: What is your purpose for reading?',
    subtitle: 'What primary outcome do you want from this book?',
    options: [
      { value: 'Entertainment', label: 'Entertainment', desc: 'Pure joy, narrative escapism, and leisure', icon: Smile },
      { value: 'Learning', label: 'Learning', desc: 'Mastering a specific craft, discipline, or technical domain', icon: GraduationCap },
      { value: 'Motivation', label: 'Motivation', desc: 'Overcoming obstacles and fueling determination', icon: Rocket },
      { value: 'Knowledge', label: 'Knowledge', desc: 'Expanding broad wisdom, historical, or worldly perspectives', icon: Library },
      { value: 'Personal Development', label: 'Personal Development', desc: 'Behavioral change, emotional quotient, and character growth', icon: Target },
    ]
  }
];

export default function RecommendationForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [preferences, setPreferences] = useState({
    genre: '',
    mood: '',
    reading_difficulty: '',
    preferred_length: '',
    language: '',
    reading_purpose: ''
  });

  const [loading, setLoading] = useState(false);
  const [loadingStepText, setLoadingStepText] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [viewMode, setViewMode] = useState('wizard'); // 'wizard' or 'all-in-one'

  const currentQuestion = QUESTIONS[currentStep];
  const progressPercent = Math.round(((currentStep + 1) / QUESTIONS.length) * 100);

  const handleSelectOption = (fieldId, val) => {
    setPreferences((prev) => ({
      ...prev,
      [fieldId]: val
    }));
    setErrorMessage('');

    // If in wizard mode, auto-advance smoothly to next question if not at end
    if (viewMode === 'wizard' && currentStep < QUESTIONS.length - 1) {
      setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 250);
    }
  };

  const handleNext = () => {
    const currentField = currentQuestion.id;
    if (!preferences[currentField]) {
      setErrorMessage('Please select an option before proceeding.');
      return;
    }
    setErrorMessage('');
    if (currentStep < QUESTIONS.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    setErrorMessage('');
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    // Verify all 6 fields are completed
    const missing = QUESTIONS.filter((q) => !preferences[q.id]);
    if (missing.length > 0) {
      setErrorMessage(`Please answer all questions before submitting. Missing: ${missing.map(m => m.id).join(', ')}`);
      return;
    }

    setLoading(true);
    setErrorMessage('');

    // Simulated animated forward-chaining steps for viva demonstration
    setLoadingStepText('Initializing Working Memory with User Facts...');
    await new Promise((r) => setTimeout(r, 400));
    setLoadingStepText('Evaluating 20 Predefined IF–THEN Rules (Forward Chaining)...');
    await new Promise((r) => setTimeout(r, 450));
    setLoadingStepText(`Applying Mandatory Language Filter for "${preferences.language}"...`);
    await new Promise((r) => setTimeout(r, 400));
    setLoadingStepText('Computing Weighted Recommendation Scores (0–100%)...');

    try {
      const response = await getRecommendations(preferences);
      // Save in sessionStorage as fallback
      sessionStorage.setItem('smartbook_last_results', JSON.stringify(response));
      sessionStorage.setItem('smartbook_last_prefs', JSON.stringify(preferences));

      navigate('/results', {
        state: {
          results: response,
          preferences: preferences
        }
      });
    } catch (err) {
      setLoading(false);
      setErrorMessage(`Failed to evaluate recommendations: ${err.message}`);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Top Breadcrumb & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Interactive AI Questionnaire</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Book Preference <span className="text-gradient">Questionnaire</span>
          </h1>
          <p className="mt-1 text-slate-600 text-xs sm:text-sm">
            Provide your reading interests to trigger forward-chaining rule matching.
          </p>
        </div>

        {/* View Mode Toggle */}
        <div className="flex items-center gap-2 bg-slate-100 p-1 rounded-xl text-xs font-semibold shrink-0">
          <button
            onClick={() => setViewMode('wizard')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'wizard' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Step-by-Step
          </button>
          <button
            onClick={() => setViewMode('all-in-one')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              viewMode === 'all-in-one' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Questions View
          </button>
        </div>
      </div>

      {/* Progress Bar (Wizard Mode) */}
      {viewMode === 'wizard' && (
        <div className="mb-8 bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-indigo-600">
              Step {currentStep + 1} of {QUESTIONS.length}
            </span>
            <span className="text-slate-500">{progressPercent}% Completed</span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-slate-100 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-600 to-brand-600 rounded-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercent}%` }}
            ></div>
          </div>

          {/* Quick Step Indicators */}
          <div className="flex items-center justify-between mt-3 pt-3 border-t border-slate-100">
            {QUESTIONS.map((q, idx) => {
              const isAnswered = !!preferences[q.id];
              const isCurrent = idx === currentStep;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    setCurrentStep(idx);
                    setErrorMessage('');
                  }}
                  className={`flex items-center gap-1.5 text-[11px] font-medium transition-all ${
                    isCurrent
                      ? 'text-indigo-600 font-bold'
                      : isAnswered
                      ? 'text-emerald-600'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  <span
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${
                      isCurrent
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-700'
                        : 'bg-slate-100 text-slate-500'
                    }`}
                  >
                    {isAnswered ? <Check className="w-3 h-3" /> : idx + 1}
                  </span>
                  <span className="hidden md:inline capitalize">{q.id.replace('_', ' ')}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Error Alert */}
      {errorMessage && (
        <div className="mb-6 p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Loading Modal Overlay during AI Inference */}
      {loading && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-md p-4">
          <div className="bg-white rounded-3xl p-8 max-w-md w-full shadow-2xl border border-slate-200 text-center animate-scaleUp">
            <div className="relative w-16 h-16 mx-auto mb-5">
              <div className="absolute inset-0 rounded-full border-4 border-indigo-100"></div>
              <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
              <Cpu className="w-7 h-7 text-indigo-600 absolute inset-0 m-auto" />
            </div>

            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Evaluating Rule-Based AI Engine
            </h3>
            
            <p className="text-xs text-indigo-600 font-semibold bg-indigo-50 py-2 px-3 rounded-xl mb-4 border border-indigo-100 animate-pulse">
              {loadingStepText}
            </p>

            <div className="space-y-2 text-left text-xs text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Extracted user facts ({preferences.genre}, {preferences.mood}, {preferences.language})</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>Checking premise conditions across knowledge base</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                <span>Computing deterministic match percentages</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* WIZARD MODE (ONE QUESTION AT A TIME)                 */}
      {/* ---------------------------------------------------- */}
      {viewMode === 'wizard' && (
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/90 shadow-sm transition-all">
          
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
              {currentQuestion.title}
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              {currentQuestion.subtitle}
            </p>
          </div>

          {/* Options Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-8">
            {currentQuestion.options.map((opt) => {
              const Icon = opt.icon;
              const isSelected = preferences[currentQuestion.id] === opt.value;
              return (
                <div
                  key={opt.value}
                  onClick={() => handleSelectOption(currentQuestion.id, opt.value)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all flex items-start gap-3.5 ${
                    isSelected
                      ? 'border-indigo-600 bg-indigo-50/70 shadow-md shadow-indigo-500/10 scale-[1.01]'
                      : 'border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-sm'
                        : 'bg-white text-slate-600 border border-slate-200'
                    }`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className={`text-sm font-bold ${isSelected ? 'text-indigo-900' : 'text-slate-900'}`}>
                        {opt.label}
                      </span>
                      {isSelected && (
                        <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px]">
                          <Check className="w-3 h-3" />
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                      {opt.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 0}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                currentStep === 0
                  ? 'opacity-40 cursor-not-allowed text-slate-400'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back</span>
            </button>

            {currentStep < QUESTIONS.length - 1 ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all hover:scale-105 active:scale-95"
              >
                <span>Continue</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-700 hover:to-brand-700 text-white text-sm font-bold shadow-lg shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Find My Books</span>
              </button>
            )}
          </div>

        </div>
      )}

      {/* ---------------------------------------------------- */}
      {/* ALL QUESTIONS VIEW (FOR QUICK TESTING & COLLEGE VIVA) */}
      {/* ---------------------------------------------------- */}
      {viewMode === 'all-in-one' && (
        <div className="space-y-8">
          {QUESTIONS.map((q, idx) => (
            <div key={q.id} className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-sm">
              <div className="mb-4">
                <span className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider">
                  Question {idx + 1}
                </span>
                <h3 className="text-xl font-bold text-slate-900">{q.title}</h3>
                <p className="text-xs text-slate-500 mt-0.5">{q.subtitle}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {q.options.map((opt) => {
                  const Icon = opt.icon;
                  const isSelected = preferences[q.id] === opt.value;
                  return (
                    <div
                      key={opt.value}
                      onClick={() => handleSelectOption(q.id, opt.value)}
                      className={`p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex items-center gap-3 ${
                        isSelected
                          ? 'border-indigo-600 bg-indigo-50/70 shadow-sm text-indigo-900 font-semibold'
                          : 'border-slate-200/80 bg-slate-50/50 hover:bg-white text-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isSelected ? 'text-indigo-600' : 'text-slate-400'}`} />
                      <div className="flex-1 text-xs">
                        <div>{opt.label}</div>
                      </div>
                      {isSelected && <Check className="w-4 h-4 text-indigo-600 shrink-0" />}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Submit Button */}
          <div className="text-center pt-4">
            <button
              onClick={handleSubmit}
              className="inline-flex items-center gap-2 px-10 py-4 rounded-2xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-700 hover:to-brand-700 text-white text-base font-bold shadow-xl shadow-indigo-500/25 hover:scale-105 active:scale-95 transition-all"
            >
              <Sparkles className="w-5 h-5" />
              <span>Find My Books</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}

      {/* Working Memory Fact Preview Sidebar/Tray */}
      <div className="mt-10 p-5 rounded-2xl bg-slate-100/80 border border-slate-200 text-xs text-slate-600">
        <div className="flex items-center justify-between mb-2">
          <span className="font-bold text-slate-900 flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-indigo-600" />
            <span>Working Memory Facts (Rule Input Vector):</span>
          </span>
          <button
            onClick={() => setPreferences({
              genre: '',
              mood: '',
              reading_difficulty: '',
              preferred_length: '',
              language: '',
              reading_purpose: ''
            })}
            className="text-[11px] font-semibold text-slate-500 hover:text-rose-600 transition-colors flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {Object.entries(preferences).map(([key, val]) => (
            <span
              key={key}
              className={`px-2.5 py-1 rounded-lg border font-mono text-[11px] ${
                val
                  ? 'bg-white border-indigo-200 text-indigo-700 font-semibold shadow-xs'
                  : 'bg-slate-200/50 border-dashed border-slate-300 text-slate-400'
              }`}
            >
              <span className="text-slate-400">{key}: </span>
              <span>{val || 'Not Selected'}</span>
            </span>
          ))}
        </div>
      </div>

    </div>
  );
}
