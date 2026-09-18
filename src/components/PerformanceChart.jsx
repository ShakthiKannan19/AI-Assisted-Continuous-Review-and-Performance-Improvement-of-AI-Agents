import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceLine
} from 'recharts';

export default function PerformanceChart({ data = [] }) {
  if (!data || data.length === 0) {
    return (
      <div className="h-72 flex items-center justify-center text-slate-500 text-xs">
        No evaluation history available yet.
      </div>
    );
  }

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const item = payload[0].payload;
      return (
        <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs space-y-1">
          <p className="font-semibold text-slate-200">{label} ({item.time || ''})</p>
          <p className="text-[11px] text-slate-400 font-mono">Agent: {item.agentVersion}</p>
          <div className="pt-1.5 border-t border-slate-800 space-y-1">
            <p className="text-brand-400 font-bold">Overall Score: {item.overall}/10</p>
            <p className="text-emerald-400">Correctness: {item.correctness}/10</p>
            <p className="text-cyan-400">Relevance: {item.relevance}/10</p>
            <p className="text-amber-400">Completeness: {item.completeness}/10</p>
            <p className="text-purple-400">Clarity: {item.clarity}/10</p>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-72 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" />
          <XAxis 
            dataKey="date" 
            stroke="#64748b" 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
          />
          <YAxis 
            domain={[0, 10]} 
            stroke="#64748b" 
            tick={{ fill: '#94a3b8', fontSize: 11 }} 
            ticks={[0, 2, 4, 6, 8, 10]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            wrapperStyle={{ fontSize: 12, paddingTop: 10 }}
          />
          <ReferenceLine y={8.0} stroke="#10b981" strokeDasharray="3 3" label={{ value: 'Pass (8.0)', fill: '#10b981', fontSize: 10 }} />
          <ReferenceLine y={6.0} stroke="#f59e0b" strokeDasharray="3 3" label={{ value: 'Needs Imp (6.0)', fill: '#f59e0b', fontSize: 10 }} />
          
          <Line 
            type="monotone" 
            dataKey="overall" 
            name="Overall Score"
            stroke="#818cf8" 
            strokeWidth={3} 
            dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }} 
            activeDot={{ r: 6, fill: '#4f46e5' }} 
          />
          <Line 
            type="monotone" 
            dataKey="completeness" 
            name="Completeness"
            stroke="#f59e0b" 
            strokeWidth={1.5} 
            strokeDasharray="4 4"
            dot={false}
          />
          <Line 
            type="monotone" 
            dataKey="clarity" 
            name="Clarity"
            stroke="#c084fc" 
            strokeWidth={1.5} 
            strokeDasharray="4 4"
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
