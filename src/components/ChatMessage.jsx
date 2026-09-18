import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import EvaluationCard from './EvaluationCard';
import { formatDate } from '../utils/helpers';

export default function ChatMessage({ message }) {
  const [copied, setCopied] = useState(false);
  const isUser = message.sender === 'user';

  const copyToClipboard = () => {
    navigator.clipboard.writeText(message.text || message.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (isUser) {
    return (
      <div className="flex justify-end mb-4">
        <div className="flex flex-col items-end max-w-[85%] sm:max-w-[75%]">
          <div className="bg-blue-600 text-white rounded-xl px-4 py-2.5 text-sm leading-relaxed whitespace-pre-wrap">
            {message.text || message.content}
          </div>
          <span className="text-[11px] text-gray-400 mt-1 px-1">
            {formatDate(message.timestamp || message.created_at)}
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex justify-start mb-6">
      <div className="flex flex-col items-start w-full">
        {/* AI Message Card */}
        <div className="relative group bg-white border border-gray-200 rounded-xl p-4 sm:p-5 w-full text-sm text-gray-800 leading-relaxed shadow-xs">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-gray-100">
            <span className="text-xs font-semibold text-gray-700">AI</span>
            <div className="flex items-center gap-2">
              <span className="text-[11px] text-gray-400">
                {formatDate(message.timestamp || message.created_at)}
              </span>
              <button
                onClick={copyToClipboard}
                className="p-1 text-gray-400 hover:text-gray-600 rounded bg-gray-50 hover:bg-gray-100 transition-colors"
                title="Copy response"
              >
                {copied ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
              </button>
            </div>
          </div>

          <div className="whitespace-pre-wrap font-sans leading-relaxed text-gray-800">
            {message.text || message.content}
          </div>

          {/* Embedded Response Review */}
          {message.evaluation && (
            <div className="mt-4 pt-1">
              <EvaluationCard evaluation={message.evaluation} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
