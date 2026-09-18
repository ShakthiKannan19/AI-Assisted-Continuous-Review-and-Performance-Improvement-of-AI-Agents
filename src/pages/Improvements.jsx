import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Lightbulb, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  ArrowRight, 
  Layers, 
  Flame, 
  Sliders, 
  Clock,
  ShieldAlert
} from 'lucide-react';
import { StorageService } from '../services/storageService';

export default function Improvements() {
  const [insights, setInsights] = useState([]);
  const [analyzing, setAnalyzing] = useState(false);
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    loadInsights();
  }, []);

  const loadInsights = () => {
    const list = StorageService.getImprovementInsights();
    const met = StorageService.getMetrics();
    setInsights(list);
    setMetrics(met);
  };

  const handleReanalyze = () => {
    setAnalyzing(true);
    setTimeout(() => {
      loadInsights();
      setAnalyzing(false);
    }, 1000);
  };

  const getSeverityBadge = (sev) => {
    switch (sev) {
      case 'CRITICAL':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'HIGH':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'MEDIUM':
        return 'bg-brand-500/10 text-brand-300 border-brand-500/30';
      default:
        return 'bg-slate-800 text-slate-300 border-slate-700';
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'IMPLEMENTED_IN_V2':
        return { label: 'Implemented in Agent V2', color: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' };
      case 'TESTING':
        return { label: 'In Testing', color: 'bg-purple-500/10 text-purple-400 border-purple-500/30' };
      default:
        return { label: 'Pending Review', color: 'bg-amber-500/10 text-amber-400 border-amber-500/30' };
    }
  };

  return (
    <div className="space-y-8 pb-16">
      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-500/10 text-brand-300 border border-brand-500/30 text-xs font-semibold">
              <Sparkles size={14} />
              <span>AI-Assisted Improvement Engine</span>
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Automated Weakness Detection & Prompt Optimization
            </h1>
            <p className="text-xs text-slate-300 leading-relaxed">
              The continuous improvement engine analyzes historical evaluation logs, extracts recurring quality deficiencies, and formulates prompt modifications to elevate AI agent performance.
            </p>
          </div>

          <button
            onClick={handleReanalyze}
            disabled={analyzing}
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-glow transition-all disabled:opacity-50"
          >
            <RefreshCw size={15} className={analyzing ? 'animate-spin' : ''} />
            <span>{analyzing ? 'Analyzing Evaluation Logs...' : 'Re-Run Weakness Scan'}</span>
          </button>
        </div>
      </div>

      {/* Engine Status & Strategy Workflow Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Step 1: Collect</span>
          <p className="text-sm font-bold text-white">Continuous Logging</p>
          <p className="text-[11px] text-slate-500">Every AI interaction is scored across 5 dimensions.</p>
        </div>
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Step 2: Detect</span>
          <p className="text-sm font-bold text-white">Pattern Recognition</p>
          <p className="text-[11px] text-slate-500">Identifies criteria consistently scoring &lt; 8.0.</p>
        </div>
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">Step 3: Recommend</span>
          <p className="text-sm font-bold text-white">Prompt Synthesis</p>
          <p className="text-[11px] text-slate-500">Generates precise prompt updates and guidelines.</p>
        </div>
        <div className="bg-slate-900/80 rounded-2xl p-4 border border-slate-800 space-y-1">
          <span className="text-[11px] font-semibold text-emerald-400 uppercase tracking-wider">Step 4: Verify</span>
          <p className="text-sm font-bold text-emerald-300">Version Benchmarking</p>
          <p className="text-[11px] text-slate-500">Measures delta between V1 baseline and V2 agent.</p>
        </div>
      </div>

      {/* Recommended Prompt Improvements List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-400" />
            <span>Active Quality Improvement Recommendations ({insights.length})</span>
          </h2>
          <span className="text-xs text-slate-400">
            Based on {metrics?.total || 0} historical evaluations
          </span>
        </div>

        <div className="space-y-4">
          {insights.map((item) => {
            const statusInfo = getStatusBadge(item.status);
            return (
              <div 
                key={item.id}
                className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4 hover:border-slate-700 transition-all duration-200 shadow-md"
              >
                {/* Item Top Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
                  <div className="flex items-center gap-2.5">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${getSeverityBadge(item.severity)}`}>
                      {item.severity} Priority
                    </span>
                    <h3 className="text-sm font-bold text-slate-100">
                      {item.title}
                    </h3>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border self-start sm:self-auto ${statusInfo.color}`}>
                    {statusInfo.label}
                  </span>
                </div>

                {/* Problem Statement */}
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-rose-400 flex items-center gap-1.5">
                    <AlertTriangle size={13} />
                    <span>Detected Defect Pattern:</span>
                  </span>
                  <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-xl border border-slate-800/80">
                    {item.detectedProblem}
                  </p>
                </div>

                {/* Actionable Prompt Recommendation */}
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 size={13} />
                    <span>Recommended Prompt Modification:</span>
                  </span>
                  <div className="bg-slate-950 p-3.5 rounded-xl border border-brand-500/20 font-mono text-xs text-slate-200 leading-relaxed">
                    {item.recommendation}
                  </div>
                </div>

                {/* Footer Metrics & Impact */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                  <div className="p-3 bg-brand-950/20 rounded-xl border border-brand-500/10">
                    <span className="text-[11px] font-semibold text-brand-300">Expected Performance Impact:</span>
                    <p className="text-slate-300 font-medium mt-0.5">{item.potentialImpact}</p>
                  </div>
                  <div className="p-3 bg-slate-900/60 rounded-xl border border-slate-800">
                    <span className="text-[11px] font-semibold text-slate-400">Target Agent Transition:</span>
                    <p className="text-slate-300 font-mono mt-0.5">{item.targetAgent}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
