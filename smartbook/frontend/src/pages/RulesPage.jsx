import React, { useEffect, useState } from 'react';
import { Cpu, ShieldCheck, CheckCircle2, ArrowRight } from 'lucide-react';
import { getRules } from '../services/api';

export default function RulesPage() {
  const [rules, setRules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getRules()
      .then((data) => {
        setRules(data.rules || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-3">
          <Cpu className="w-3.5 h-3.5" />
          <span>Knowledge Base Inspector</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Predefined <span className="text-gradient">IF–THEN Expert Rules</span>
        </h1>
        <p className="mt-2 text-slate-600 max-w-3xl text-sm">
          These deterministic rules define the expert system knowledge base. During execution, user facts are matched via Forward Chaining to fire actions and compute compatibility scores.
        </p>
      </div>

      {loading && (
        <div className="flex items-center justify-center p-12 text-slate-500">
          <div className="w-6 h-6 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin mr-3"></div>
          Loading Knowledge Base Rules...
        </div>
      )}

      {error && (
        <div className="p-4 rounded-xl bg-red-50 border border-red-200 text-red-700 text-sm">
          Failed to load rules: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {rules.map((rule) => (
          <div
            key={rule.rule_id}
            className="p-5 rounded-2xl bg-white border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow relative overflow-hidden"
          >
            <div className="flex items-center justify-between mb-2">
              <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-indigo-50 text-indigo-700 border border-indigo-200">
                {rule.rule_id}
              </span>
              <span className="text-xs font-medium text-slate-400">
                Weight: {rule.weight} pts
              </span>
            </div>

            <h3 className="font-semibold text-slate-900 text-base mb-2">
              {rule.name}
            </h3>

            {/* IF Conditions */}
            <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100 text-xs mb-3 space-y-1">
              <span className="font-bold text-indigo-600 tracking-wide">IF (PREMISE):</span>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {Object.entries(rule.conditions || {}).map(([key, val]) => (
                  <span
                    key={key}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white border border-slate-200 font-mono text-[11px] text-slate-700"
                  >
                    <span className="text-slate-400">{key}:</span>
                    <span className="font-semibold text-slate-900">{val}</span>
                  </span>
                ))}
              </div>
            </div>

            {/* THEN Action */}
            <div className="text-xs mb-2">
              <span className="font-bold text-brand-600 tracking-wide">THEN (ACTION): </span>
              <span className="text-slate-700">{rule.action}</span>
            </div>

            {/* Explanation */}
            <div className="text-[11px] text-slate-500 italic border-t border-slate-100 pt-2 mt-2">
              " {rule.explanation} "
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
