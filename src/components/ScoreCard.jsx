import React from 'react';
import { getScoreColor, getScoreProgressBarColor, formatScore } from '../utils/helpers';

export default function ScoreCard({ title, score, maxScore = 10, icon: Icon, subtitle, change, trend = 'up' }) {
  const percentage = Math.min(100, Math.max(0, (score / maxScore) * 100));
  const scoreColor = getScoreColor(score);
  const barColor = getScoreProgressBarColor(score);

  return (
    <div className="glass-card rounded-2xl p-5 border border-slate-800/80 hover:border-slate-700 transition-all duration-300 group shadow-lg hover:shadow-glow/10">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">{title}</p>
          <div className="mt-2 flex items-baseline gap-2">
            <span className={`text-3xl font-bold tracking-tight ${scoreColor}`}>
              {formatScore(score)}
            </span>
            <span className="text-xs font-medium text-slate-500">/{maxScore}</span>
          </div>
        </div>
        {Icon && (
          <div className="p-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-brand-400 group-hover:scale-110 group-hover:bg-brand-500/10 group-hover:border-brand-500/30 transition-all duration-300">
            <Icon size={20} />
          </div>
        )}
      </div>

      {/* Progress Bar */}
      <div className="mt-4">
        <div className="w-full bg-slate-800 rounded-full h-1.5 overflow-hidden">
          <div 
            className={`h-full rounded-full ${barColor} transition-all duration-700 ease-out`}
            style={{ width: `${percentage}%` }}
          />
        </div>
      </div>

      {/* Subtitle / Change Indicator */}
      <div className="mt-3 flex items-center justify-between text-xs">
        {subtitle && <span className="text-slate-400 truncate">{subtitle}</span>}
        {change !== undefined && (
          <span className={`font-semibold ml-auto flex items-center gap-0.5 ${trend === 'up' ? 'text-emerald-400' : 'text-rose-400'}`}>
            {trend === 'up' ? '↑' : '↓'} {change}
          </span>
        )}
      </div>
    </div>
  );
}
