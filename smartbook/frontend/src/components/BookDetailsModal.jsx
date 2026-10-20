import React from 'react';
import { X, Star, BookOpen, Globe2, Compass, Layers, Heart, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function BookDetailsModal({ book, onClose }) {
  if (!book) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fadeIn">
      <div 
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden transform transition-all animate-scaleUp"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 rounded-full bg-slate-100/80 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-5 max-h-[85vh] overflow-y-auto">
          {/* Left Column: Cover & Quick Stats */}
          <div className="md:col-span-2 bg-gradient-to-br from-indigo-50 to-brand-50 p-6 flex flex-col items-center justify-center border-b md:border-b-0 md:border-r border-slate-200">
            <div className="relative group shadow-xl rounded-xl overflow-hidden w-40 h-56 bg-slate-200 mb-4 border-2 border-white">
              <img
                src={book.cover_image}
                alt={book.title}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
                }}
              />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full bg-black/70 backdrop-blur-md text-amber-300 text-xs font-bold flex items-center gap-1">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                {book.rating ? Number(book.rating).toFixed(1) : '4.8'}
              </div>
            </div>

            <div className="w-full space-y-2 text-xs">
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60 text-slate-600">
                <span className="flex items-center gap-1.5"><Globe2 className="w-3.5 h-3.5 text-indigo-500" /> Language:</span>
                <span className="font-semibold text-slate-800">{book.language}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60 text-slate-600">
                <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5 text-indigo-500" /> Page Count:</span>
                <span className="font-semibold text-slate-800">{book.pages} pages</span>
              </div>
              <div className="flex items-center justify-between py-1 text-slate-600">
                <span className="flex items-center gap-1.5"><Compass className="w-3.5 h-3.5 text-indigo-500" /> Difficulty:</span>
                <span className="font-semibold text-slate-800">{book.reading_difficulty}</span>
              </div>
            </div>
          </div>

          {/* Right Column: Metadata & Synopsis */}
          <div className="md:col-span-3 p-6 sm:p-8 flex flex-col justify-between">
            <div>
              <div className="flex flex-wrap gap-1.5 mb-2.5">
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {book.genre}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-brand-50 text-brand-700 border border-brand-200">
                  Mood: {book.suitable_mood}
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {book.reading_purpose}
                </span>
              </div>

              <h2 className="text-2xl font-bold text-slate-900 tracking-tight leading-snug">
                {book.title}
              </h2>
              <p className="text-sm font-medium text-slate-500 mb-4">
                By <span className="text-indigo-600 font-semibold">{book.author}</span>
              </p>

              <div className="mb-6">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                  Synopsis & Book Overview
                </h4>
                <p className="text-sm text-slate-600 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                  {book.description}
                </p>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-800 transition-colors"
              >
                Close
              </button>
              <Link
                to="/recommend"
                onClick={onClose}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-brand-600 hover:from-indigo-700 hover:to-brand-700 text-white text-sm font-semibold shadow-md shadow-indigo-500/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
              >
                <Sparkles className="w-4 h-4" />
                <span>Find My Match</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
