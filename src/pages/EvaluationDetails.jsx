import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  ShieldCheck, 
  Copy, 
  Check, 
  AlertCircle, 
  CheckCircle, 
  Lightbulb, 
  Layers, 
  Calendar, 
  Clock, 
  Code2, 
  Bot, 
  User,
  Trash2
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import Badge from '../components/Badge';
import JsonViewer from '../components/JsonViewer';
import { formatScore, getScoreColor, getScoreProgressBarColor, formatDate } from '../utils/helpers';

export default function EvaluationDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [evaluation, setEvaluation] = useState(null);
  const [copiedPrompt, setCopiedPrompt] = useState(false);
  const [copiedResponse, setCopiedResponse] = useState(false);

  useEffect(() => {
    const item = StorageService.getEvaluationById(id);
    setEvaluation(item);
  }, [id]);

  if (!evaluation) {
    return (
      <div className="py-16 text-center space-y-4">
        <p className="text-slate-400">Evaluation record not found.</p>
        <Link 
          to="/evaluations"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-600 text-white text-xs font-semibold"
        >
          <ArrowLeft size={14} />
          <span>Back to Evaluations</span>
        </Link>
      </div>
    );
  }

  const copyText = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'prompt') {
      setCopiedPrompt(true);
      setTimeout(() => setCopiedPrompt(false), 2000);
    } else {
      setCopiedResponse(true);
      setTimeout(() => setCopiedResponse(false), 2000);
    }
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this evaluation?')) {
      StorageService.deleteEvaluation(id);
      navigate('/evaluations');
    }
  };

  const criteria = [
    { 
      label: 'Correctness', 
      score: evaluation.correctness_score, 
      desc: 'Is the information factually accurate and technically sound?' 
    },
    { 
      label: 'Relevance', 
      score: evaluation.relevance_score, 
      desc: 'Does the response directly answer the specific question asked?' 
    },
    { 
      label: 'Completeness', 
      score: evaluation.completeness_score, 
      desc: 'Are all essential explanations, edge cases, and parameters covered?' 
    },
    { 
      label: 'Clarity', 
      score: evaluation.clarity_score, 
      desc: 'Is the language precise, structured, and easy to comprehend?' 
    },
    { 
      label: 'Instruction Following', 
      score: evaluation.instruction_following_score, 
      desc: 'Did the model adhere to all user prompt constraints (e.g. code examples)?' 
    },
  ];

  return (
    <div className="space-y-6 pb-16 max-w-5xl mx-auto">
      {/* Top Navigation & Actions Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/evaluations"
          className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft size={16} />
          <span>Back to Audit Logs</span>
        </Link>

        <div className="flex items-center gap-3">
          <button
            onClick={handleDelete}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 text-xs font-medium transition-colors"
          >
            <Trash2 size={14} />
            <span>Delete Record</span>
          </button>
        </div>
      </div>

      {/* Main Assessment Header Card */}
      <div className="glass-card rounded-3xl p-6 lg:p-8 border border-slate-800 shadow-2xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span className="font-mono text-brand-400">{evaluation.id}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar size={13} /> {formatDate(evaluation.created_at)}
              </span>
              <span>•</span>
              <span className="px-2 py-0.5 rounded bg-slate-800 font-mono text-slate-300 border border-slate-700">
                Agent Version: {evaluation.agent_version || evaluation.agent_id}
              </span>
            </div>

            <h1 className="text-xl lg:text-2xl font-bold text-white tracking-tight">
              Evaluation Audit Summary
            </h1>
          </div>

          {/* Verdict and Overall Score */}
          <div className="flex items-center gap-5 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 self-start md:self-auto">
            <div>
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Overall Quality Score</p>
              <div className={`text-3xl font-black font-mono mt-0.5 ${getScoreColor(evaluation.overall_score)}`}>
                {formatScore(evaluation.overall_score)}
                <span className="text-sm text-slate-500 font-normal"> / 10</span>
              </div>
            </div>

            <div className="h-10 w-px bg-slate-800" />

            <div className="space-y-1">
              <p className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold">Verdict</p>
              <Badge verdict={evaluation.verdict} size="md" />
            </div>
          </div>
        </div>
      </div>

      {/* Two-Column Grid: User Prompt & AI Response */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* User Prompt */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <User size={16} className="text-brand-400" />
              <span>User Input Prompt</span>
            </div>
            <button
              onClick={() => copyText(evaluation.user_input, 'prompt')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Copy Prompt"
            >
              {copiedPrompt ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
          <p className="text-sm text-slate-200 font-medium leading-relaxed italic bg-slate-950/60 p-4 rounded-xl border border-slate-800/80">
            "{evaluation.user_input}"
          </p>
        </div>

        {/* AI Agent Response */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Bot size={16} className="text-cyan-400" />
              <span>AI Agent Generated Response</span>
            </div>
            <button
              onClick={() => copyText(evaluation.ai_response, 'response')}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              title="Copy Response"
            >
              {copiedResponse ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
            </button>
          </div>
          <div className="text-xs text-slate-300 leading-relaxed max-h-72 overflow-y-auto whitespace-pre-wrap bg-slate-950/60 p-4 rounded-xl border border-slate-800/80 font-sans">
            {evaluation.ai_response}
          </div>
        </div>
      </div>

      {/* 5-Criteria Deep Breakdown */}
      <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-5">
        <h2 className="text-base font-bold text-white flex items-center gap-2">
          <ShieldCheck size={18} className="text-brand-400" />
          <span>Independent Evaluator Multi-Criteria Audit</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {criteria.map((item) => (
            <div key={item.label} className="bg-slate-950/70 p-4 rounded-xl border border-slate-800/80 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-slate-200">{item.label}</span>
                <span className={`text-sm font-mono font-bold ${getScoreColor(item.score)}`}>
                  {formatScore(item.score)}/10
                </span>
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                <div
                  className={`h-full rounded-full ${getScoreProgressBarColor(item.score)}`}
                  style={{ width: `${Math.min(100, (item.score / 10) * 100)}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Strengths, Weaknesses & Improvement Engine Output */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Strengths */}
        <div className="bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
            <CheckCircle size={16} />
            <span>Validated Strengths</span>
          </div>
          {evaluation.strengths && evaluation.strengths.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-300">
              {evaluation.strengths.map((str, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-emerald-950/40 p-2.5 rounded-xl border border-emerald-500/10">
                  <span className="text-emerald-400 font-bold">•</span>
                  <span>{str}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No specific strengths documented.</p>
          )}
        </div>

        {/* Weaknesses */}
        <div className="bg-rose-950/20 border border-rose-500/20 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-rose-400 uppercase tracking-wider">
            <AlertCircle size={16} />
            <span>Identified Weaknesses</span>
          </div>
          {evaluation.weaknesses && evaluation.weaknesses.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-300">
              {evaluation.weaknesses.map((weak, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-rose-950/40 p-2.5 rounded-xl border border-rose-500/10">
                  <span className="text-rose-400 font-bold">•</span>
                  <span>{weak}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No significant weaknesses found. Excellent response.</p>
          )}
        </div>

        {/* Suggestions */}
        <div className="bg-brand-950/20 border border-brand-500/20 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-xs font-bold text-brand-300 uppercase tracking-wider">
            <Lightbulb size={16} />
            <span>Improvement Recommendations</span>
          </div>
          {evaluation.improvement_suggestions && evaluation.improvement_suggestions.length > 0 ? (
            <ul className="space-y-2 text-xs text-slate-300">
              {evaluation.improvement_suggestions.map((sug, idx) => (
                <li key={idx} className="flex items-start gap-2 bg-brand-950/40 p-2.5 rounded-xl border border-brand-500/10">
                  <span className="text-brand-400 font-bold">→</span>
                  <span>{sug}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-500 italic">No prompt tuning required.</p>
          )}
        </div>
      </div>

      {/* Raw JSON Payload Viewer */}
      <JsonViewer data={evaluation} title={`Evaluation Payload: ${evaluation.id}`} />
    </div>
  );
}
