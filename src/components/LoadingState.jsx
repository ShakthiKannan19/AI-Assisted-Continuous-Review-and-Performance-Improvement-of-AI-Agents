import React from 'react';
import { Bot, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

export function ChatLoadingState({ step = 'generating' }) {
  return (
    <div className="flex flex-col items-start mb-6 animate-in fade-in duration-300">
      <div className="flex items-start gap-3 max-w-[85%]">
        <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-cyan-500 flex items-center justify-center text-white shadow-glow/30 animate-pulse">
          <Bot size={18} />
        </div>

        <div className="flex flex-col space-y-3">
          {/* Agent Generating Bubble */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-2xl rounded-tl-none p-4 shadow-lg min-w-[280px]">
            <div className="flex items-center gap-3">
              <Loader2 size={18} className="animate-spin text-brand-400" />
              <div className="space-y-1">
                <p className="text-xs font-semibold text-slate-200">
                  {step === 'evaluating' ? 'Gemini AI Evaluator Reviewing...' : 'Gemini AI Agent Generating Response...'}
                </p>
                <p className="text-[11px] text-slate-400">
                  {step === 'evaluating' ? 'Scoring correctness, relevance, completeness, clarity...' : 'Synthesizing technical explanation...'}
                </p>
              </div>
            </div>

            {/* Skeleton placeholder bars */}
            <div className="mt-3 space-y-2 pt-2 border-t border-slate-800/60">
              <div className="h-2 bg-slate-800 rounded-full w-full animate-pulse" />
              <div className="h-2 bg-slate-800 rounded-full w-4/5 animate-pulse" />
              <div className="h-2 bg-slate-800 rounded-full w-2/3 animate-pulse" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800 animate-pulse space-y-3">
      <div className="h-4 bg-slate-800 rounded w-1/3" />
      <div className="h-8 bg-slate-800 rounded w-1/2" />
      <div className="h-2 bg-slate-800 rounded w-full" />
    </div>
  );
}
