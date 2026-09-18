import React, { useState, useRef, useEffect } from 'react';
import { Send, AlertCircle, RefreshCw } from 'lucide-react';
import ChatMessage from '../components/ChatMessage';
import { ApiService } from '../services/api';
import { getUserFriendlyError } from '../utils/helpers';

const SUGGESTIONS = [
  'What is Spring Boot in Java?',
  'Explain polymorphism in Java',
  'What is a REST API?'
];

export default function Chat({ onRegisterReset }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [lastFailedMessage, setLastFailedMessage] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);
  const [conversationId, setConversationId] = useState(`conv-${Date.now()}`);

  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const resetChat = () => {
    setMessages([]);
    setInput('');
    setLoading(false);
    setLastFailedMessage(null);
    setErrorMessage(null);
    setConversationId(`conv-${Date.now()}`);
  };

  useEffect(() => {
    if (onRegisterReset) {
      onRegisterReset(resetChat);
    }
  }, [onRegisterReset]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading, errorMessage]);

  const handleSend = async (textToSend) => {
    const text = (textToSend || input).trim();
    if (!text || loading) return;

    const userMsg = {
      id: `msg-${Date.now()}`,
      sender: 'user',
      content: text,
      timestamp: new Date().toISOString()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setLoading(true);
    setErrorMessage(null);
    setLastFailedMessage(null);

    try {
      const response = await ApiService.sendEvaluationRequest({
        message: text,
        conversationId: conversationId,
        agentId: 'agent-v1'
      });

      const aiMsg = {
        id: `msg-${Date.now()}-ai`,
        sender: 'ai',
        content: response.answer,
        evaluation: response.evaluation,
        timestamp: new Date().toISOString()
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Request failed:', err);
      setLastFailedMessage(text);
      setErrorMessage(getUserFriendlyError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastFailedMessage) {
      const retryText = lastFailedMessage;
      setErrorMessage(null);
      setLastFailedMessage(null);
      handleSend(retryText);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-61px)] bg-gray-50/50">
      {/* Scrollable Conversation Area */}
      <div className="flex-1 overflow-y-auto px-4 py-6">
        <div className="max-w-4xl mx-auto w-full">
          {messages.length === 0 ? (
            /* Compact Empty State */
            <div className="py-16 text-center max-w-lg mx-auto">
              <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                Ask the AI a question
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">
                Ask a question to get started.
              </p>

              <div className="mt-5 flex flex-wrap justify-center gap-2">
                {SUGGESTIONS.map((suggestion) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSend(suggestion)}
                    className="text-xs bg-white hover:bg-gray-50 border border-gray-200 text-gray-700 px-3 py-2 rounded-lg transition-colors shadow-2xs"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <>
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}

              {/* Thinking / Loading indicator */}
              {loading && (
                <div className="flex justify-start mb-6">
                  <div className="bg-white border border-gray-200 rounded-xl p-3.5 text-sm text-gray-700 flex items-center gap-2 shadow-2xs">
                    <span className="text-xs font-semibold text-gray-700">AI</span>
                    <span className="text-gray-300">•</span>
                    <span>Thinking</span>
                    <span className="flex gap-1 items-center ml-1">
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                      <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></span>
                    </span>
                  </div>
                </div>
              )}

              {/* Friendly Inline Error Box with Retry */}
              {errorMessage && (
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
                  <div className="flex items-center gap-2">
                    <AlertCircle size={15} className="text-red-600 shrink-0" />
                    <span>{errorMessage}</span>
                  </div>
                  {lastFailedMessage && (
                    <button
                      onClick={handleRetry}
                      disabled={loading}
                      className="self-start sm:self-auto inline-flex items-center gap-1 px-2.5 py-1 rounded bg-red-100 hover:bg-red-200 text-red-800 font-medium transition-colors cursor-pointer"
                    >
                      <RefreshCw size={12} />
                      <span>Try Again</span>
                    </button>
                  )}
                </div>
              )}
            </>
          )}

          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Sticky Bottom Input Area */}
      <div className="border-t border-gray-200 bg-white px-4 py-3 shrink-0">
        <div className="max-w-4xl mx-auto w-full">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center bg-white border border-gray-300 rounded-xl focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-500 transition-all px-3 py-1.5"
          >
            <textarea
              ref={inputRef}
              rows={1}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something..."
              disabled={loading}
              className="w-full bg-transparent text-sm text-gray-900 placeholder-gray-400 py-2 focus:outline-none resize-none font-sans"
            />

            <button
              type="submit"
              disabled={!input.trim() || loading}
              className={`ml-2 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                input.trim() && !loading
                  ? 'bg-blue-600 hover:bg-blue-700 text-white cursor-pointer'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
              }`}
            >
              Send
            </button>
          </form>
          <p className="text-[11px] text-center text-gray-400 mt-1.5">
            Enter to send · Shift + Enter for new line
          </p>
        </div>
      </div>
    </div>
  );
}
