import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Page components (implemented across upcoming tasks)
import HomePage from './pages/HomePage';
import RecommendationForm from './pages/RecommendationForm';
import ResultsPage from './pages/ResultsPage';
import BookExplorer from './pages/BookExplorer';
import RulesPage from './pages/RulesPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/recommend" element={<RecommendationForm />} />
            <Route path="/results" element={<ResultsPage />} />
            <Route path="/explore" element={<BookExplorer />} />
            <Route path="/rules" element={<RulesPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}
