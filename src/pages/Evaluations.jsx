import React, { useState, useEffect } from 'react';
import { 
  ClipboardCheck, 
  Search, 
  Filter, 
  ArrowUpDown, 
  Trash2, 
  ExternalLink, 
  Layers, 
  Eye,
  SlidersHorizontal,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { StorageService } from '../services/storageService';
import Badge from '../components/Badge';
import { formatScore, getScoreColor, formatDate, truncate } from '../utils/helpers';

export default function Evaluations() {
  const [evaluations, setEvaluations] = useState([]);
  const [search, setSearch] = useState('');
  const [verdictFilter, setVerdictFilter] = useState('ALL');
  const [versionFilter, setVersionFilter] = useState('ALL');
  const [sortBy, setSortBy] = useState('newest'); // newest, oldest, highest_score, lowest_score

  useEffect(() => {
    loadEvaluations();
  }, []);

  const loadEvaluations = () => {
    const list = StorageService.getEvaluations();
    setEvaluations(list);
  };

  const handleDelete = (e, id) => {
    e.preventDefault();
    e.stopPropagation();
    if (window.confirm('Delete this evaluation record?')) {
      const updated = StorageService.deleteEvaluation(id);
      setEvaluations(updated);
    }
  };

  // Filter & sort logic
  const filtered = evaluations.filter((item) => {
    const matchSearch = 
      item.user_input?.toLowerCase().includes(search.toLowerCase()) ||
      item.ai_response?.toLowerCase().includes(search.toLowerCase()) ||
      item.id?.toLowerCase().includes(search.toLowerCase());

    const matchVerdict = verdictFilter === 'ALL' || item.verdict === verdictFilter;
    const matchVersion = 
      versionFilter === 'ALL' || 
      item.agent_id === versionFilter || 
      item.agent_version?.toLowerCase().includes(versionFilter.toLowerCase());

    return matchSearch && matchVerdict && matchVersion;
  }).sort((a, b) => {
    if (sortBy === 'newest') return new Date(b.created_at) - new Date(a.created_at);
    if (sortBy === 'oldest') return new Date(a.created_at) - new Date(b.created_at);
    if (sortBy === 'highest_score') return b.overall_score - a.overall_score;
    if (sortBy === 'lowest_score') return a.overall_score - b.overall_score;
    return 0;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Header & Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold text-white flex items-center gap-2">
            <ClipboardCheck size={22} className="text-brand-400" />
            <span>Evaluation History & Audit Logs</span>
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Complete database of AI Agent responses and independent evaluator scores
          </p>
        </div>

        <div className="text-xs font-mono text-slate-400 bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl self-start md:self-auto">
          Total Logs: <span className="font-bold text-slate-200">{filtered.length}</span> / {evaluations.length}
        </div>
      </div>

      {/* Filters Bar */}
      <div className="glass-card rounded-2xl p-4 border border-slate-800 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <Search size={16} className="absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by user question, response content, or evaluation ID..."
              className="w-full bg-slate-900/90 text-xs text-slate-200 pl-10 pr-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-brand-500 focus:ring-1 focus:ring-brand-500"
            />
          </div>

          {/* Verdict Filter */}
          <div>
            <select
              value={verdictFilter}
              onChange={(e) => setVerdictFilter(e.target.value)}
              className="w-full bg-slate-900/90 text-xs text-slate-200 px-3 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-brand-500"
            >
              <option value="ALL">All Verdicts</option>
              <option value="PASS">PASS (≥ 8.0)</option>
              <option value="NEEDS_IMPROVEMENT">NEEDS IMPROVEMENT (6.0 - 7.9)</option>
              <option value="FAIL">FAIL (&lt; 6.0)</option>
            </select>
          </div>

          {/* Sort Filter */}
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full bg-slate-900/90 text-xs text-slate-200 px-3 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-brand-500"
            >
              <option value="newest">Sort: Newest First</option>
              <option value="oldest">Sort: Oldest First</option>
              <option value="highest_score">Sort: Highest Score</option>
              <option value="lowest_score">Sort: Lowest Score</option>
            </select>
          </div>
        </div>
      </div>

      {/* Evaluations Table / Cards List */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center border border-slate-800 space-y-3">
          <p className="text-slate-400 text-sm">No evaluation records matched your filters.</p>
          <button
            onClick={() => { setSearch(''); setVerdictFilter('ALL'); setVersionFilter('ALL'); }}
            className="text-xs text-brand-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => (
            <Link
              key={item.id}
              to={`/evaluations/${item.id}`}
              className="block glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-brand-500/40 transition-all duration-200 group shadow-md hover:shadow-glow/10"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Metadata + Question */}
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    <span className="font-mono text-slate-500 text-[11px]">{item.id}</span>
                    <span className="text-slate-600">•</span>
                    <span className="text-slate-400">{formatDate(item.created_at)}</span>
                    <span className="text-slate-600">•</span>
                    <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[10px] border border-slate-700">
                      {item.agent_version || item.agent_id || 'v1.0.0'}
                    </span>
                  </div>

                  <h3 className="text-sm font-semibold text-slate-100 group-hover:text-brand-300 transition-colors">
                    "{item.user_input}"
                  </h3>

                  <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                    {item.ai_response}
                  </p>
                </div>

                {/* Right: Scores, Verdict, Actions */}
                <div className="flex items-center justify-between lg:justify-end gap-5 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-800/80">
                  {/* Criteria mini indicators */}
                  <div className="hidden sm:grid grid-cols-5 gap-1.5 text-center text-[10px]">
                    <div className="p-1.5 bg-slate-950/80 rounded-lg border border-slate-800">
                      <div className="text-slate-500">Cor</div>
                      <div className="font-mono font-bold text-slate-300">{formatScore(item.correctness_score)}</div>
                    </div>
                    <div className="p-1.5 bg-slate-950/80 rounded-lg border border-slate-800">
                      <div className="text-slate-500">Rel</div>
                      <div className="font-mono font-bold text-slate-300">{formatScore(item.relevance_score)}</div>
                    </div>
                    <div className="p-1.5 bg-slate-950/80 rounded-lg border border-slate-800">
                      <div className="text-slate-500">Com</div>
                      <div className="font-mono font-bold text-slate-300">{formatScore(item.completeness_score)}</div>
                    </div>
                    <div className="p-1.5 bg-slate-950/80 rounded-lg border border-slate-800">
                      <div className="text-slate-500">Cla</div>
                      <div className="font-mono font-bold text-slate-300">{formatScore(item.clarity_score)}</div>
                    </div>
                    <div className="p-1.5 bg-slate-950/80 rounded-lg border border-slate-800">
                      <div className="text-slate-500">Ins</div>
                      <div className="font-mono font-bold text-slate-300">{formatScore(item.instruction_following_score)}</div>
                    </div>
                  </div>

                  {/* Overall & Verdict */}
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <div className={`text-lg font-bold font-mono ${getScoreColor(item.overall_score)}`}>
                        {formatScore(item.overall_score)}<span className="text-xs text-slate-500">/10</span>
                      </div>
                    </div>
                    <Badge verdict={item.verdict} size="sm" />
                  </div>

                  {/* Action Icons */}
                  <div className="flex items-center gap-1 text-slate-400 group-hover:text-brand-300">
                    <button
                      onClick={(e) => handleDelete(e, item.id)}
                      className="p-2 hover:text-rose-400 hover:bg-slate-800/80 rounded-lg transition-colors"
                      title="Delete record"
                    >
                      <Trash2 size={16} />
                    </button>
                    <div className="p-2 group-hover:translate-x-1 transition-transform">
                      <ChevronRight size={18} />
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
