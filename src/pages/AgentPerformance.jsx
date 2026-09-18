import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  TrendingUp, 
  Layers, 
  ArrowUpRight, 
  CheckCircle2, 
  Sparkles, 
  ShieldCheck, 
  Zap, 
  Award,
  AlertCircle
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend 
} from 'recharts';
import { StorageService } from '../services/storageService';
import ScoreCard from '../components/ScoreCard';
import { formatScore, getScoreColor } from '../utils/helpers';

export default function AgentPerformance() {
  const [data, setData] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    const comparison = StorageService.getVersionComparison();
    setData(comparison);
  };

  if (!data) return null;

  const { v1Stats, v2Stats, deltaOverall, deltaPassRate, criteriaComparison } = data;

  return (
    <div className="space-y-8 pb-16">
      {/* Title Header */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <Activity size={22} className="text-brand-400" />
          <span>Agent Version Performance Benchmarking</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Quantitative comparison between Baseline Agent (V1) and Continuous-Evaluation-Tuned Agent (V2)
        </p>
      </div>

      {/* Head-to-Head Comparison Card */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          {/* Agent V1 Card */}
          <div className="bg-slate-900/80 rounded-2xl p-5 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 font-mono text-xs border border-slate-700">
                Agent V1.0.0
              </span>
              <span className="text-[11px] text-slate-500 font-medium">Baseline Prompt</span>
            </div>
            <div>
              <p className="text-xs text-slate-400">Mean Quality Score</p>
              <div className="text-3xl font-black font-mono text-slate-200 mt-1">
                {formatScore(v1Stats.avgOverall)}<span className="text-sm text-slate-500">/10</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Pass Rate:</span>
              <span className="font-semibold text-slate-200">{v1Stats.passRate}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Evaluations:</span>
              <span className="font-mono text-slate-300">{v1Stats.count}</span>
            </div>
          </div>

          {/* Delta Indicator (Middle) */}
          <div className="flex flex-col items-center justify-center p-4 rounded-2xl bg-gradient-to-b from-brand-950/40 to-slate-900 border border-brand-500/20 text-center space-y-2">
            <div className="p-3 rounded-full bg-brand-500/20 border border-brand-500/40 text-brand-300">
              <TrendingUp size={24} />
            </div>
            <div>
              <p className="text-xs uppercase tracking-wider font-semibold text-brand-300">Net Improvement</p>
              <div className="text-2xl lg:text-3xl font-black text-emerald-400 font-mono mt-1">
                +{deltaOverall} pts
              </div>
            </div>
            <span className="text-xs text-emerald-400 font-semibold bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
              +{deltaPassRate}% Pass Rate Boost
            </span>
          </div>

          {/* Agent V2 Card */}
          <div className="bg-gradient-to-br from-brand-950/40 to-slate-900/90 rounded-2xl p-5 border border-brand-500/30 space-y-3 shadow-glow/20">
            <div className="flex items-center justify-between">
              <span className="px-2.5 py-1 rounded-lg bg-brand-500/20 text-brand-300 font-mono text-xs border border-brand-500/30">
                Agent V2.0.0
              </span>
              <span className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                <Sparkles size={12} /> Evaluator-Optimized
              </span>
            </div>
            <div>
              <p className="text-xs text-slate-400">Mean Quality Score</p>
              <div className="text-3xl font-black font-mono text-emerald-400 mt-1">
                {formatScore(v2Stats.avgOverall)}<span className="text-sm text-slate-500">/10</span>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs">
              <span className="text-slate-400">Pass Rate:</span>
              <span className="font-semibold text-emerald-400">{v2Stats.passRate}%</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Total Evaluations:</span>
              <span className="font-mono text-slate-300">{v2Stats.count}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Criteria Comparison Bar Chart */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <ShieldCheck size={18} className="text-cyan-400" />
            <span>Criteria-by-Criteria Performance Delta</span>
          </h2>
          <p className="text-xs text-slate-400">
            Agent V1 Baseline (Slate) vs Agent V2 Optimized (Indigo) across all 5 evaluation metrics
          </p>
        </div>

        <div className="h-80 w-full pt-4">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={criteriaComparison} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
              <XAxis dataKey="criterion" stroke="#64748b" tick={{ fill: '#cbd5e1', fontSize: 11 }} />
              <YAxis domain={[0, 10]} stroke="#64748b" tick={{ fill: '#94a3b8', fontSize: 11 }} ticks={[0, 2, 4, 6, 8, 10]} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '0.75rem', fontSize: '12px' }}
                formatter={(val, name) => [`${val}/10`, name === 'v1' ? 'Agent V1 Baseline' : 'Agent V2 Optimized']}
              />
              <Legend 
                wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
                formatter={(val) => val === 'v1' ? 'Agent V1 (Baseline)' : 'Agent V2 (Optimized)'}
              />
              <Bar dataKey="v1" fill="#475569" radius={[4, 4, 0, 0]} name="v1" />
              <Bar dataKey="v2" fill="#6366f1" radius={[4, 4, 0, 0]} name="v2" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Prompt Evolution Details */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <Sparkles size={18} className="text-brand-400" />
          <span>System Prompt Engineering Progression</span>
        </h2>
        <p className="text-xs text-slate-400">
          How continuous AI evaluator feedback shaped the system prompts between versions
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {/* V1 Prompt */}
          <div className="bg-slate-900/90 rounded-xl p-4 border border-slate-800 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-slate-300">
              <span>Agent V1 System Prompt (Baseline)</span>
              <span className="text-slate-500 font-mono">v1.0.0</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-400 whitespace-pre-wrap leading-relaxed">
{`You are a helpful AI assistant.
Answer the user's technical question accurately and concisely.`}
            </div>
            <div className="text-[11px] text-rose-400 bg-rose-500/10 p-2 rounded-lg border border-rose-500/20">
              ⚠️ <strong>Evaluator Issue Detected</strong>: Explanations lacked complete code examples, edge cases, and structural formatting.
            </div>
          </div>

          {/* V2 Prompt */}
          <div className="bg-brand-950/20 rounded-xl p-4 border border-brand-500/30 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-brand-300">
              <span>Agent V2 System Prompt (Optimized via Evaluator)</span>
              <span className="text-brand-400 font-mono">v2.0.0</span>
            </div>
            <div className="p-3 bg-slate-950 rounded-lg text-xs font-mono text-slate-300 whitespace-pre-wrap leading-relaxed border border-brand-500/20">
{`You are a senior technical software engineering expert.
1. Directly answer the user prompt with deep technical accuracy.
2. When answering programming questions, ALWAYS include runnable, commented code examples.
3. Structure responses with Markdown headings (###), comparison tables, and bullet points.
4. Highlight real-world trade-offs, bottlenecks, and best practices.`}
            </div>
            <div className="text-[11px] text-emerald-400 bg-emerald-500/10 p-2 rounded-lg border border-emerald-500/20">
              ✅ <strong>Evaluator Result</strong>: Completeness score increased from 6.5 to 9.5 (+3.0 pts).
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
