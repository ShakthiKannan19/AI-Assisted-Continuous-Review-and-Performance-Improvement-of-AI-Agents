import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Sparkles, 
  TrendingUp, 
  Layers, 
  ShieldCheck,
  BarChart3,
  PieChart as PieIcon,
  MessageSquare,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid 
} from 'recharts';
import { StorageService } from '../services/storageService';
import ScoreCard from '../components/ScoreCard';
import PerformanceChart from '../components/PerformanceChart';
import CriteriaRadarChart from '../components/CriteriaRadarChart';
import Badge from '../components/Badge';
import { formatScore, getScoreColor } from '../utils/helpers';

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [versionStats, setVersionStats] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const data = StorageService.getMetrics();
    const versionData = StorageService.getVersionComparison();
    setMetrics(data);
    setVersionStats(versionData);
  };

  if (!metrics) return null;

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner / Concept Card */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-brand-900/60 via-indigo-950/40 to-slate-900 border border-brand-500/20 p-6 lg:p-8 shadow-2xl">
        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-500/10 border border-brand-500/30 text-xs font-semibold text-brand-300">
              <Sparkles size={14} />
              <span>Continuous AI Quality & Performance Loop</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight">
              AI-Assisted Continuous Review of AI Agents
            </h1>
            <p className="text-sm text-slate-300 leading-relaxed">
              One AI agent generates answers, while a secondary independent AI evaluator continuously analyzes correctness, relevance, completeness, and clarity.
            </p>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto">
            <Link
              to="/chat"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white font-semibold text-sm shadow-glow transition-all duration-200"
            >
              <MessageSquare size={16} />
              <span>Launch Live Evaluation</span>
            </Link>
            <Link
              to="/improvements"
              className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-sm border border-slate-700 transition-all duration-200"
            >
              <Sparkles size={16} className="text-brand-400" />
              <span>AI Insights</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Primary KPI Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <ScoreCard
          title="Overall Quality Score"
          score={metrics.avgScore}
          subtitle={`Across ${metrics.total} evaluations`}
          icon={Activity}
          change={versionStats ? `+${versionStats.deltaOverall} vs V1` : undefined}
          trend="up"
        />
        <ScoreCard
          title="Pass Rate"
          score={(metrics.passRate / 10)}
          subtitle={`${metrics.passCount} passed out of ${metrics.total}`}
          icon={CheckCircle2}
          change={versionStats ? `+${versionStats.deltaPassRate}%` : undefined}
          trend="up"
        />
        <ScoreCard
          title="Avg Completeness"
          score={metrics.avgCompleteness}
          subtitle="Depth & essential context"
          icon={ShieldCheck}
          change={versionStats ? `+${versionStats.deltaCompleteness}` : undefined}
          trend="up"
        />
        <ScoreCard
          title="Avg Clarity"
          score={metrics.avgClarity}
          subtitle="Formatting & readability"
          icon={Sparkles}
          change={versionStats ? `+${versionStats.deltaClarity}` : undefined}
          trend="up"
        />
      </div>

      {/* Main Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Performance Trend Over Time (2 Cols) */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <TrendingUp size={18} className="text-brand-400" />
                <span>Performance Progression Over Time</span>
              </h2>
              <p className="text-xs text-slate-400">
                Evaluation score trajectories and multi-criteria progression
              </p>
            </div>
            <span className="text-xs font-mono text-brand-400 bg-brand-500/10 px-2.5 py-1 rounded-lg border border-brand-500/20">
              Live Feed
            </span>
          </div>
          <PerformanceChart data={metrics.trendData} />
        </div>

        {/* 5-Criteria Radar Chart (1 Col) */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <ShieldCheck size={18} className="text-cyan-400" />
              <span>Multi-Criteria Breakdown</span>
            </h2>
            <p className="text-xs text-slate-400">
              Evaluation metrics across 5 evaluation dimensions
            </p>
          </div>
          <CriteriaRadarChart data={metrics.criteriaScores} />
        </div>
      </div>

      {/* Secondary Analytics: Verdict Breakdown & Weakness Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verdict Distribution Pie */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800">
          <div className="mb-4">
            <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
              <PieIcon size={18} className="text-emerald-400" />
              <span>Evaluation Verdicts</span>
            </h2>
            <p className="text-xs text-slate-400">
              Distribution of Pass, Needs Improvement, and Fail
            </p>
          </div>

          <div className="h-56 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={metrics.verdictData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={75}
                  paddingAngle={4}
                >
                  {metrics.verdictData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          <div className="flex items-center justify-around text-xs mt-2 border-t border-slate-800/80 pt-3">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
              <span className="text-slate-300">Pass ({metrics.passCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
              <span className="text-slate-300">Needs Imp ({metrics.needsImprovementCount})</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-400" />
              <span className="text-slate-300">Fail ({metrics.failCount})</span>
            </div>
          </div>
        </div>

        {/* Recurring Weaknesses Frequency */}
        <div className="lg:col-span-2 glass-card rounded-2xl p-6 border border-slate-800">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-100 flex items-center gap-2">
                <AlertTriangle size={18} className="text-amber-400" />
                <span>Detected Recurring Weaknesses</span>
              </h2>
              <p className="text-xs text-slate-400">
                Weakness patterns automatically extracted from evaluator feedback
              </p>
            </div>
            <Link
              to="/improvements"
              className="text-xs font-semibold text-brand-400 hover:text-brand-300 flex items-center gap-1"
            >
              <span>View AI Recommendations</span>
              <ArrowUpRight size={14} />
            </Link>
          </div>

          {metrics.topWeaknesses.length > 0 ? (
            <div className="space-y-3">
              {metrics.topWeaknesses.map((item, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 hover:border-slate-700 transition-colors"
                >
                  <div className="flex items-start gap-2.5 max-w-[80%]">
                    <span className="px-1.5 py-0.5 rounded text-[10px] font-mono bg-rose-500/10 text-rose-400 border border-rose-500/20 shrink-0">
                      Freq: {item.count}
                    </span>
                    <p className="text-xs text-slate-300 leading-snug">
                      {item.weakness}
                    </p>
                  </div>
                  <span className="text-[11px] text-amber-400 font-medium shrink-0">
                    Needs Tuning
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-8 text-center">
              No recurring weaknesses detected. AI agents performing within thresholds.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
