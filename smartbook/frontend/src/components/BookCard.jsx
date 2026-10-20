import React from 'react';
import { Star, BookOpen, Globe2, Layers, Eye } from 'lucide-react';

export default function BookCard({ book, onSelect }) {
  const getLanguageBadgeColor = (lang) => {
    switch (lang) {
      case 'Hindi':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Marathi':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      default:
        return 'bg-blue-50 text-blue-700 border-blue-200';
    }
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col overflow-hidden">
      {/* Cover Image Container */}
      <div className="relative aspect-[3/4] w-full overflow-hidden bg-slate-100">
        <img
          src={book.cover_image}
          alt={book.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?w=600&auto=format&fit=crop&q=80';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center p-4">
          <button
            onClick={() => onSelect(book)}
            className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white/95 backdrop-blur-sm text-slate-900 text-xs font-semibold shadow-lg hover:bg-white hover:scale-[1.02] transition-all"
          >
            <Eye className="w-3.5 h-3.5 text-indigo-600" />
            <span>Quick View</span>
          </button>
        </div>

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1">
          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border backdrop-blur-md ${getLanguageBadgeColor(book.language)}`}>
            {book.language}
          </span>
        </div>

        <div className="absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-amber-300 text-xs font-semibold">
          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
          <span>{book.rating ? Number(book.rating).toFixed(1) : '4.8'}</span>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center gap-1.5 mb-1.5">
            <span className="text-[11px] font-semibold text-indigo-600 uppercase tracking-wider">
              {book.genre}
            </span>
            <span className="text-slate-300">•</span>
            <span className="text-[11px] text-slate-500">
              {book.reading_difficulty}
            </span>
          </div>

          <h3 className="font-bold text-slate-900 text-sm line-clamp-1 group-hover:text-indigo-600 transition-colors" title={book.title}>
            {book.title}
          </h3>

          <p className="text-xs text-slate-500 font-medium mb-2 line-clamp-1">
            {book.author}
          </p>

          <p className="text-[11px] text-slate-600 line-clamp-2 leading-relaxed mb-3">
            {book.description}
          </p>
        </div>

        {/* Footer Meta */}
        <div className="pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
          <span className="flex items-center gap-1">
            <Layers className="w-3 h-3 text-slate-400" />
            {book.pages} pages
          </span>
          <button
            onClick={() => onSelect(book)}
            className="font-semibold text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            Details →
          </button>
        </div>
      </div>
    </div>
  );
}
