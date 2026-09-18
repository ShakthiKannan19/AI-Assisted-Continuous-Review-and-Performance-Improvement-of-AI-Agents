import React, { useState } from 'react';
import { Copy, Check, Code2 } from 'lucide-react';

export default function JsonViewer({ data, title = 'Raw Evaluator JSON Payload' }) {
  const [copied, setCopied] = useState(false);

  const jsonString = typeof data === 'string' ? data : JSON.stringify(data, null, 2);

  const handleCopy = () => {
    navigator.clipboard.writeText(jsonString);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950 overflow-hidden font-mono text-xs">
      <div className="flex items-center justify-between px-4 py-3 bg-slate-900/80 border-b border-slate-800">
        <div className="flex items-center gap-2 text-slate-300">
          <Code2 size={15} className="text-brand-400" />
          <span className="font-semibold">{title}</span>
        </div>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors"
        >
          {copied ? (
            <>
              <Check size={12} className="text-emerald-400" />
              <span className="text-[11px] text-emerald-400">Copied</span>
            </>
          ) : (
            <>
              <Copy size={12} />
              <span className="text-[11px]">Copy JSON</span>
            </>
          )}
        </button>
      </div>

      <div className="p-4 overflow-x-auto max-h-96 text-slate-300 leading-relaxed">
        <pre>{jsonString}</pre>
      </div>
    </div>
  );
}
