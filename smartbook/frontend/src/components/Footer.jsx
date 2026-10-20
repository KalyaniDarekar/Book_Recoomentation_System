import React from 'react';
import { BookOpen, ShieldCheck, Cpu, Code2, Award } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 border-t border-slate-800 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Column 1: Project Identity */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center text-white">
                <BookOpen className="w-4 h-4" />
              </div>
              <span className="font-bold text-lg text-white tracking-tight">SmartBook</span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              An Explainable Rule-Based Expert System for personalized book recommendations based on user mood, genre, and reading traits.
            </p>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-[11px] font-medium">
              <Award className="w-3.5 h-3.5" />
              <span>AI Mini Project 2026</span>
            </div>
          </div>

          {/* Column 2: AI Techniques */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <Cpu className="w-3.5 h-3.5 text-brand-400" />
              AI Core Architecture
            </h4>
            <ul className="space-y-2 text-xs">
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-400"></span>
                <span>Rule-Based Expert System</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
                <span>Forward Chaining Inference</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400"></span>
                <span>Weighted Scoring Algorithm (0-100)</span>
              </li>
              <li className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                <span>Explainable AI (XAI) Reasoning</span>
              </li>
            </ul>
          </div>

          {/* Column 3: Navigation */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3">
              Application Pages
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link to="/" className="hover:text-white transition-colors">Home Landing</Link>
              </li>
              <li>
                <Link to="/recommend" className="hover:text-white transition-colors">Preference Questionnaire</Link>
              </li>
              <li>
                <Link to="/explore" className="hover:text-white transition-colors">Book Explorer Catalog</Link>
              </li>
              <li>
                <Link to="/rules" className="hover:text-white transition-colors">Knowledge Base Rules</Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition-colors">Admin Dashboard</Link>
              </li>
            </ul>
          </div>

          {/* Column 4: Technology Stack */}
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-200 mb-3 flex items-center gap-1.5">
              <Code2 className="w-3.5 h-3.5 text-cyan-400" />
              Tech Stack
            </h4>
            <div className="flex flex-wrap gap-1.5 text-[11px]">
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">React + Vite</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Tailwind CSS</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Python 3</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Flask REST</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">SQLite3</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-slate-700">Lucide Icons</span>
            </div>
            <p className="mt-3 text-[11px] text-slate-300">
              Zero External ML/LLM dependencies • 100% Deterministic Rule Engine
            </p>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-300">
          <p>© 2026 SmartBook – Intelligent Book Recommendation System. Computer Engineering Viva Project.</p>
          <p className="flex items-center gap-1 text-slate-300">
            Engineered for Academic Viva Demonstration
          </p>
        </div>
      </div>
    </footer>
  );
}
