import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  MessageSquare, 
  ClipboardCheck, 
  Activity, 
  Sparkles, 
  Settings,
  ShieldAlert,
  Zap,
  Bot
} from 'lucide-react';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard, badge: null },
    { name: 'Chat', path: '/chat', icon: MessageSquare, badge: 'Live' },
    { name: 'Evaluations', path: '/evaluations', icon: ClipboardCheck, badge: null },
    { name: 'Agent Performance', path: '/performance', icon: Activity, badge: 'V1 vs V2' },
    { name: 'Improvements', path: '/improvements', icon: Sparkles, badge: 'AI Engine' },
    { name: 'Settings', path: '/settings', icon: Settings, badge: null },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-dark-sidebar border-r border-slate-800/80 flex flex-col transition-transform duration-300 ease-in-out
        lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        {/* Brand Logo & Header */}
        <div className="h-16 flex items-center gap-3 px-6 border-b border-slate-800/80 bg-dark-header/40">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 via-indigo-600 to-cyan-400 flex items-center justify-center text-white shadow-glow">
            <Zap size={20} className="fill-white" />
          </div>
          <div>
            <h1 className="font-bold text-sm text-slate-100 tracking-tight flex items-center gap-1.5">
              <span>EvalAgent</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded bg-brand-500/20 text-brand-300 font-mono border border-brand-500/30">AI</span>
            </h1>
            <p className="text-[10px] text-slate-400 font-medium truncate max-w-[140px]">
              Continuous Review Platform
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="flex-1 py-6 px-3 space-y-1.5 overflow-y-auto">
          <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-500">
            Core Modules
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = location.pathname === item.path;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                onClick={onClose}
                className={`
                  flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 group
                  ${isActive 
                    ? 'bg-brand-600/15 text-brand-400 border border-brand-500/30 shadow-sm' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border border-transparent'
                  }
                `}
              >
                <div className="flex items-center gap-3">
                  <Icon 
                    size={18} 
                    className={`transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-brand-400' : 'text-slate-400 group-hover:text-slate-200'
                    }`} 
                  />
                  <span>{item.name}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono ${
                    isActive 
                      ? 'bg-brand-500/20 text-brand-300 border border-brand-500/30' 
                      : 'bg-slate-800 text-slate-400'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </NavLink>
            );
          })}
        </div>

        {/* System Status Footer Card */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/40">
          <div className="rounded-xl p-3 bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
              <span className="text-xs font-semibold text-slate-200">Dual-AI Pipeline</span>
            </div>
            <p className="text-[11px] text-slate-400 leading-snug">
              Gemini Generator + Gemini Evaluator in continuous loop.
            </p>
          </div>
        </div>
      </aside>
    </>
  );
}
