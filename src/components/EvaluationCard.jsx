import React from 'react';
import Badge from './Badge';
import { formatScore, getScoreColor, getScoreProgressBarColor } from '../utils/helpers';

export default function EvaluationCard({ evaluation }) {
  if (!evaluation) return null;

  const criteria = [
    { label: 'Correctness', score: evaluation.correctness_score ?? evaluation.correctness ?? 0 },
    { label: 'Relevance', score: evaluation.relevance_score ?? evaluation.relevance ?? 0 },
    { label: 'Completeness', score: evaluation.completeness_score ?? evaluation.completeness ?? 0 },
    { label: 'Clarity', score: evaluation.clarity_score ?? evaluation.clarity ?? 0 },
    { label: 'Instruction Following', score: evaluation.instruction_following_score ?? evaluation.instruction_following ?? 0 },
  ];

  const overall = evaluation.overall_score ?? 0;
  const verdict = evaluation.verdict || 'PASS';

  const strengths = evaluation.strengths || [];
  const weaknesses = evaluation.weaknesses || [];
  const suggestions = evaluation.improvement_suggestions || [];

  return (
    <div className="mt-3 bg-gray-50 border border-gray-200 rounded-xl p-4 text-gray-800">
      {/* Title & Score */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-gray-200">
        <div>
          <h4 className="text-sm font-semibold text-gray-900">Response Review</h4>
          <div className="flex items-baseline gap-1.5 mt-0.5">
            <span className="text-xs text-gray-500">Overall Score:</span>
            <span className={`text-sm font-bold ${getScoreColor(overall)}`}>
              {formatScore(overall)} <span className="text-xs font-normal text-gray-500">/ 10</span>
            </span>
          </div>
        </div>
        <Badge verdict={verdict} />
      </div>

      {/* Criteria Breakdown */}
      <div className="mt-3 space-y-2">
        {criteria.map((item) => {
          const score = Number(item.score);
          const percent = Math.min(100, Math.max(0, (score / 10) * 100));
          return (
            <div key={item.label} className="text-xs">
              <div className="flex justify-between items-center mb-1">
                <span className="text-gray-700 font-medium">{item.label}</span>
                <span className="text-gray-900 font-semibold">{formatScore(score)}/10</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full ${getScoreProgressBarColor(score)}`}
                  style={{ width: `${percent}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Strengths */}
      {strengths.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-800 mb-1">Strengths</p>
          <ul className="space-y-1 text-xs text-gray-600">
            {strengths.map((str, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-gray-400">•</span>
                <span>{str}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {weaknesses.length > 0 && (
        <div className="mt-2.5 pt-2.5 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-800 mb-1">Weaknesses</p>
          <ul className="space-y-1 text-xs text-gray-600">
            {weaknesses.map((weak, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-gray-400">•</span>
                <span>{weak}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {suggestions.length > 0 && (
        <div className="mt-2.5 pt-2.5 border-t border-gray-200">
          <p className="text-xs font-semibold text-gray-800 mb-1">Suggestions</p>
          <ul className="space-y-1 text-xs text-gray-600">
            {suggestions.map((sug, idx) => (
              <li key={idx} className="flex items-start gap-1.5">
                <span className="text-gray-400">•</span>
                <span>{sug}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
