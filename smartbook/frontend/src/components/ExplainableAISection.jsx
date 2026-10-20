import React, { useState } from 'react';
import { 
  Cpu, 
  CheckCircle2, 
  HelpCircle, 
  Layers, 
  Sparkles, 
  ShieldCheck, 
  BarChart3, 
  ChevronDown, 
  ChevronUp,
  Info,
  ArrowRight
} from 'lucide-react';

export default function ExplainableAISection({ results, userPreferences }) {
  const [expandedRule, setExpandedRule] = useState(null);
  const [showFormulaDetails, setShowFormulaDetails] = useState(false);

  if (!results) return null;

  const matchedRules = results.matched_rules || [];
  const totalEvaluated = results.total_rules_evaluated || 20;
  const totalFired = results.total_rules_fired || matchedRules.length;
  const candidatesEvaluated = results.total_candidates_evaluated || 0;

  return (
    <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-6 sm:p-10 transition-all">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-semibold mb-2">
            <Cpu className="w-3.5 h-3.5" />
            <span>Explainable AI (XAI) Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            How Our AI Made This Decision
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Complete transparency into the forward-chaining reasoning, fired rules, and point computations.
          </p>
        </div>

        {/* Viva Badge */}
        <div className="px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-right shrink-0">
          <div className="text-[10px] uppercase font-bold text-slate-400">Inference Type</div>
          <div className="text-xs font-bold text-indigo-600 flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-indigo-600" />
            <span>Forward Chaining (Deterministic)</span>
          </div>
        </div>
      </div>

      {/* Grid: Fact Vector & Inference Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 py-8 border-b border-slate-100">
        
        {/* Left: Extracted User Facts */}
        <div className="lg:col-span-2 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-indigo-600" />
            Working Memory Facts (User Inputs)
          </h3>
          
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {Object.entries(userPreferences || {}).map(([key, val]) => (
              <div
                key={key}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs"
              >
                <div className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
                  {key.replace('_', ' ')}
                </div>
                <div className="font-bold text-slate-900 text-sm mt-0.5 truncate">
                  {val || 'Not Specified'}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Engine Execution Stats */}
        <div className="space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
            <BarChart3 className="w-3.5 h-3.5 text-brand-600" />
            Inference Telemetry
          </h3>

          <div className="bg-gradient-to-br from-indigo-50/70 to-brand-50/50 p-4 rounded-2xl border border-indigo-100 space-y-2.5 text-xs">
            <div className="flex items-center justify-between text-slate-600">
              <span>Rules in Knowledge Base:</span>
              <span className="font-bold text-slate-900">{totalEvaluated}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Rules Successfully Fired:</span>
              <span className="font-bold text-brand-700 bg-brand-100 px-2 py-0.5 rounded-full">{totalFired}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600">
              <span>Eligible Books Evaluated:</span>
              <span className="font-bold text-slate-900">{candidatesEvaluated}</span>
            </div>
            <div className="flex items-center justify-between text-slate-600 pt-1 border-t border-indigo-200/60">
              <span>Language Constraint:</span>
              <span className="font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                Strict {userPreferences?.language || 'English'}
              </span>
            </div>
          </div>
        </div>

      </div>

      {/* Fired Rules List */}
      <div className="py-8 border-b border-slate-100">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600" />
            <span>Matched Knowledge Rules ({matchedRules.length})</span>
          </h3>
          <span className="text-xs text-slate-500">
            Rules whose IF condition premises were fully met
          </span>
        </div>

        <div className="space-y-3">
          {matchedRules.map((rule) => {
            const isExpanded = expandedRule === rule.rule_id;
            return (
              <div
                key={rule.rule_id}
                className="rounded-2xl border border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors overflow-hidden"
              >
                <div
                  onClick={() => setExpandedRule(isExpanded ? null : rule.rule_id)}
                  className="p-4 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-lg bg-indigo-100 text-indigo-800 border border-indigo-200">
                      {rule.rule_id}
                    </span>
                    <span className="font-semibold text-sm text-slate-900">
                      {rule.name}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-400 hidden sm:inline">
                      {isExpanded ? 'Hide details' : 'View premise'}
                    </span>
                    {isExpanded ? (
                      <ChevronUp className="w-4 h-4 text-slate-500" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500" />
                    )}
                  </div>
                </div>

                {isExpanded && (
                  <div className="px-4 pb-4 pt-1 text-xs border-t border-slate-200/60 bg-white space-y-2 animate-fadeIn">
                    <div className="text-slate-600">
                      <span className="font-bold text-brand-600">Recommendation Action: </span>
                      {rule.action || 'Boosted matching genre and reading attributes.'}
                    </div>
                    <div className="text-slate-500 italic bg-slate-50 p-3 rounded-xl border border-slate-100">
                      "{rule.explanation}"
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Weighted Scoring Formula Details Toggle */}
      <div className="pt-6">
        <button
          onClick={() => setShowFormulaDetails(!showFormulaDetails)}
          className="flex items-center justify-between w-full text-left text-xs font-semibold text-slate-600 hover:text-indigo-600 transition-colors"
        >
          <span className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-600" />
            <span>How Compatibility Scores (0–100%) Are Calculated (Viva Defense Proof)</span>
          </span>
          {showFormulaDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>

        {showFormulaDetails && (
          <div className="mt-4 p-5 rounded-2xl bg-slate-50 border border-slate-200 text-xs text-slate-600 space-y-3 animate-fadeIn">
            <p className="leading-relaxed">
              Every book candidate within the selected language is evaluated deterministically against your working memory facts using fixed weights. The score is a <strong>rule-based compatibility metric</strong>, not an estimated probability.
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-center pt-2">
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <div className="font-bold text-indigo-600 text-base">40 pts</div>
                <div className="text-[10px] text-slate-500 uppercase mt-0.5">Genre Match</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <div className="font-bold text-brand-600 text-base">20 pts</div>
                <div className="text-[10px] text-slate-500 uppercase mt-0.5">Mood Match</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <div className="font-bold text-cyan-600 text-base">15 pts</div>
                <div className="text-[10px] text-slate-500 uppercase mt-0.5">Purpose Match</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200">
                <div className="font-bold text-emerald-600 text-base">15 pts</div>
                <div className="text-[10px] text-slate-500 uppercase mt-0.5">Difficulty Match</div>
              </div>
              <div className="p-2.5 rounded-xl bg-white border border-slate-200 col-span-2 sm:col-span-1">
                <div className="font-bold text-amber-600 text-base">10 pts</div>
                <div className="text-[10px] text-slate-500 uppercase mt-0.5">Length Match</div>
              </div>
            </div>

            <p className="text-[11px] text-slate-500 italic text-center pt-1">
              Total Score = 40 + 20 + 15 + 15 + 10 = 100 Points Maximum.
            </p>
          </div>
        )}
      </div>

    </div>
  );
}
