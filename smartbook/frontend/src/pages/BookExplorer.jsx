import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Filter, 
  Compass, 
  X, 
  RotateCcw, 
  SlidersHorizontal, 
  Sparkles,
  BookOpen
} from 'lucide-react';
import { getBooks } from '../services/api';
import BookCard from '../components/BookCard';
import BookDetailsModal from '../components/BookDetailsModal';

const GENRES = [
  'All',
  'Fiction',
  'Mystery',
  'Romance',
  'Science Fiction',
  'Fantasy',
  'Horror',
  'Biography',
  'Self-Help',
  'Technology',
  'History'
];

const LANGUAGES = ['All', 'English', 'Hindi', 'Marathi'];
const DIFFICULTIES = ['All', 'Beginner', 'Intermediate', 'Advanced'];

export default function BookExplorer() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedDifficulty, setSelectedDifficulty] = useState('All');
  const [sortBy, setSortBy] = useState('rating'); // 'rating', 'title', 'pages_asc', 'pages_desc'
  const [selectedBook, setSelectedBook] = useState(null);

  useEffect(() => {
    setLoading(true);
    getBooks()
      .then((data) => {
        setBooks(data.books || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  // Filter & sort logic memoized for smooth client-side interaction
  const filteredBooks = useMemo(() => {
    return books
      .filter((book) => {
        // Search term matching
        if (searchTerm) {
          const q = searchTerm.toLowerCase();
          const matchTitle = (book.title || '').toLowerCase().includes(q);
          const matchAuthor = (book.author || '').toLowerCase().includes(q);
          const matchDesc = (book.description || '').toLowerCase().includes(q);
          if (!matchTitle && !matchAuthor && !matchDesc) return false;
        }

        // Genre match
        if (selectedGenre !== 'All' && book.genre !== selectedGenre) {
          return false;
        }

        // Language match
        if (selectedLanguage !== 'All' && book.language !== selectedLanguage) {
          return false;
        }

        // Difficulty match
        if (selectedDifficulty !== 'All' && book.reading_difficulty !== selectedDifficulty) {
          return false;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'rating') {
          return (b.rating || 0) - (a.rating || 0);
        } else if (sortBy === 'title') {
          return a.title.localeCompare(b.title);
        } else if (sortBy === 'pages_asc') {
          return a.pages - b.pages;
        } else if (sortBy === 'pages_desc') {
          return b.pages - a.pages;
        }
        return 0;
      });
  }, [books, searchTerm, selectedGenre, selectedLanguage, selectedDifficulty, sortBy]);

  const hasActiveFilters = 
    searchTerm !== '' || 
    selectedGenre !== 'All' || 
    selectedLanguage !== 'All' || 
    selectedDifficulty !== 'All';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedGenre('All');
    setSelectedLanguage('All');
    setSelectedDifficulty('All');
    setSortBy('rating');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      
      {/* Header Banner */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
          <Compass className="w-3.5 h-3.5" />
          <span>Complete Knowledge Catalog</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          Explore <span className="text-gradient">Book Library</span>
        </h1>
        <p className="mt-2 text-slate-600 text-sm max-w-2xl">
          Search and filter across our verified collection of 54+ literary works spanning English, Hindi, and Marathi editions.
        </p>
      </div>

      {/* Search & Control Panel */}
      <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/90 shadow-sm mb-8 space-y-5">
        
        {/* Top Row: Search Input & Sort Dropdown */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by title, author, or keyword (e.g., Habits, Premchand, Sapiens)..."
              className="w-full pl-11 pr-10 py-3 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Sort By Dropdown */}
          <div className="sm:w-56 shrink-0">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full py-3 px-4 rounded-2xl bg-slate-50 border border-slate-200 text-sm text-slate-700 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all cursor-pointer"
            >
              <option value="rating">Sort: Highest Rated</option>
              <option value="title">Sort: Title (A-Z)</option>
              <option value="pages_asc">Sort: Pages (Shortest First)</option>
              <option value="pages_desc">Sort: Pages (Longest First)</option>
            </select>
          </div>
        </div>

        {/* Filter Pills Row */}
        <div className="space-y-3 pt-2 border-t border-slate-100">
          
          {/* Genre Filter Scroll */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
            <span className="font-semibold text-slate-500 shrink-0 text-xs mr-1">Genre:</span>
            {GENRES.map((g) => (
              <button
                key={g}
                onClick={() => setSelectedGenre(g)}
                className={`px-3 py-1.5 rounded-xl font-medium shrink-0 transition-all ${
                  selectedGenre === g
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-500/20'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200/80 hover:text-slate-900'
                }`}
              >
                {g}
              </button>
            ))}
          </div>

          {/* Secondary Filters: Language & Difficulty */}
          <div className="flex flex-wrap items-center justify-between gap-4 pt-2">
            <div className="flex flex-wrap items-center gap-4 text-xs">
              
              {/* Language Radio Group */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-500">Language:</span>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {LANGUAGES.map((lang) => (
                    <button
                      key={lang}
                      onClick={() => setSelectedLanguage(lang)}
                      className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
                        selectedLanguage === lang
                          ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Radio Group */}
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-slate-500">Reading Level:</span>
                <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                  {DIFFICULTIES.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => setSelectedDifficulty(diff)}
                      className={`px-2.5 py-1 rounded-lg transition-all font-medium ${
                        selectedDifficulty === diff
                          ? 'bg-white text-indigo-700 shadow-sm font-semibold'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              </div>

            </div>

            {/* Clear All Filters button */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="flex items-center gap-1.5 text-xs font-semibold text-rose-600 hover:text-rose-800 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset All Filters</span>
              </button>
            )}

          </div>

        </div>

      </div>

      {/* Results Meta Status */}
      <div className="flex items-center justify-between mb-6 text-xs text-slate-500">
        <div>
          Showing <span className="font-bold text-slate-900">{filteredBooks.length}</span> of{' '}
          <span className="font-bold text-slate-900">{books.length}</span> books
        </div>
        {hasActiveFilters && (
          <div className="flex items-center gap-1.5 text-indigo-600 font-medium">
            <span>Filters active</span>
          </div>
        )}
      </div>

      {/* Loading & Error States */}
      {loading && (
        <div className="p-20 text-center text-slate-500">
          <div className="w-8 h-8 border-3 border-indigo-600 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
          Loading books catalog...
        </div>
      )}

      {error && (
        <div className="p-6 rounded-2xl bg-red-50 border border-red-200 text-red-700 text-sm">
          Failed to load catalog: {error}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredBooks.length === 0 && (
        <div className="p-16 text-center bg-white rounded-3xl border border-slate-200/90 shadow-sm max-w-lg mx-auto">
          <div className="w-16 h-16 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">No books found</h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No titles matched your current search filters. Try adjusting the keywords or clear filters to see all books.
          </p>
          <button
            onClick={resetFilters}
            className="mt-5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md shadow-indigo-500/20 transition-all"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Book Grid */}
      {!loading && !error && filteredBooks.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
          {filteredBooks.map((book) => (
            <BookCard
              key={book.id}
              book={book}
              onSelect={setSelectedBook}
            />
          ))}
        </div>
      )}

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
