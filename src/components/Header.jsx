import React from 'react';
import { RotateCcw } from 'lucide-react';

export default function Header({ onNewChat }) {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-base sm:text-lg font-semibold text-gray-900 leading-tight">
            AI Agent Review
          </h1>
          <p className="text-xs text-gray-500">
            AI-assisted response evaluation
          </p>
        </div>

        {onNewChat && (
          <button
            onClick={onNewChat}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            title="Start a new conversation"
          >
            <RotateCcw size={13} />
            <span>New Chat</span>
          </button>
        )}
      </div>
    </header>
  );
}
