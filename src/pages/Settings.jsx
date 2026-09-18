import React, { useState, useEffect } from 'react';
import { 
  Settings as SettingsIcon, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Download, 
  Trash2, 
  Database, 
  Sliders, 
  Radio, 
  Globe, 
  Cpu
} from 'lucide-react';
import { StorageService } from '../services/storageService';
import { ApiService } from '../services/api';

export default function Settings() {
  const [settings, setSettings] = useState({
    n8nWebhookUrl: '',
    defaultAgentVersion: 'agent-v1',
    passThreshold: 8.0,
    needsImprovementThreshold: 6.0,
    modelName: 'gemini-1.5-flash',
    evaluatorModelName: 'gemini-1.5-pro'
  });

  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [testingConnection, setTestingConnection] = useState(false);
  const [connectionResult, setConnectionResult] = useState(null);

  useEffect(() => {
    const current = StorageService.getSettings();
    setSettings(current);
  }, []);

  const handleChange = (field, value) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = (e) => {
    e.preventDefault();
    setSaving(true);
    StorageService.saveSettings(settings);
    setTimeout(() => {
      setSaving(false);
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    }, 300);
  };

  const handleTestWebhook = async () => {
    setTestingConnection(true);
    setConnectionResult(null);
    const res = await ApiService.testConnection(settings.n8nWebhookUrl);
    setConnectionResult(res);
    setTestingConnection(false);
  };

  const handleExportData = () => {
    const data = StorageService.getEvaluations();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `n8n_ai_evaluations_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClearData = () => {
    if (window.confirm('Clear all stored evaluation logs?')) {
      StorageService.clearEvaluations();
      alert('Evaluation logs cleared.');
    }
  };

  return (
    <div className="space-y-8 pb-16 max-w-4xl mx-auto">
      {/* Page Title */}
      <div>
        <h1 className="text-xl font-bold text-white flex items-center gap-2">
          <SettingsIcon size={22} className="text-brand-400" />
          <span>System & Workflow Settings</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Configure n8n Webhook endpoint, Google Gemini AI models, and evaluation criteria thresholds
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* n8n Webhook Integration Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
            <Globe size={18} className="text-brand-400" />
            <span>n8n Webhook Endpoint Integration</span>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300">
              Webhook URL (POST)
            </label>
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="text"
                value={settings.n8nWebhookUrl}
                onChange={(e) => handleChange('n8nWebhookUrl', e.target.value)}
                placeholder="https://finalyearproject.app.n8n.cloud/webhook-test/ai-agent-evaluate"
                className="w-full bg-slate-900/90 text-xs font-mono text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleTestWebhook}
                disabled={testingConnection}
                className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors disabled:opacity-50"
              >
                <Radio size={14} className={testingConnection ? 'animate-spin text-brand-400' : ''} />
                <span>{testingConnection ? 'Pinging...' : 'Test Connection'}</span>
              </button>
            </div>
            <p className="text-[11px] text-slate-400">
              Configured via <code className="text-brand-300">VITE_N8N_WEBHOOK_URL</code>. The React frontend sends the user prompt directly to this webhook.
            </p>

            {/* Connection Test Result */}
            {connectionResult && (
              <div className={`mt-3 p-3 rounded-xl border text-xs flex items-center gap-2 ${
                connectionResult.online 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' 
                  : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
              }`}>
                {connectionResult.online ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{connectionResult.message}</span>
              </div>
            )}
          </div>
        </div>

        {/* AI Models & Agent Configuration */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
            <Cpu size={18} className="text-cyan-400" />
            <span>Dual-AI Architecture Roles</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                Default Target Agent
              </label>
              <select
                value={settings.defaultAgentVersion}
                onChange={(e) => handleChange('defaultAgentVersion', e.target.value)}
                className="w-full bg-slate-900/90 text-xs text-slate-200 px-3 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-brand-500"
              >
                <option value="agent-v1">Agent V1 (Baseline Prompt)</option>
                <option value="agent-v2">Agent V2 (Prompt-Optimized)</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                AI Pipeline Roles
              </label>
              <div className="p-2.5 bg-slate-900 rounded-xl border border-slate-800 text-[11px] text-slate-400 space-y-1">
                <div>• <strong>Generator:</strong> Gemini 1.5 Flash (Generates Answer)</div>
                <div>• <strong>Evaluator:</strong> Gemini 1.5 Pro (Independent Judge)</div>
              </div>
            </div>
          </div>
        </div>

        {/* Evaluation Thresholds */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
            <Sliders size={18} className="text-amber-400" />
            <span>Evaluation Verdict Thresholds</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                PASS Threshold (Score ≥)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={settings.passThreshold}
                onChange={(e) => handleChange('passThreshold', parseFloat(e.target.value))}
                className="w-full bg-slate-900/90 text-xs font-mono text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-brand-500"
              />
              <p className="text-[10px] text-slate-500">Scores at or above 8.0 receive PASS verdict.</p>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300">
                NEEDS IMPROVEMENT Threshold (Score ≥)
              </label>
              <input
                type="number"
                step="0.1"
                min="0"
                max="10"
                value={settings.needsImprovementThreshold}
                onChange={(e) => handleChange('needsImprovementThreshold', parseFloat(e.target.value))}
                className="w-full bg-slate-900/90 text-xs font-mono text-slate-200 px-4 py-2.5 rounded-xl border border-slate-700/80 focus:outline-none focus:border-brand-500"
              />
              <p className="text-[10px] text-slate-500">Scores between 6.0 and 7.9 receive NEEDS_IMPROVEMENT. Below 6.0 is FAIL.</p>
            </div>
          </div>
        </div>

        {/* Data Export & Reset Card */}
        <div className="glass-card rounded-2xl p-6 border border-slate-800 space-y-4">
          <div className="flex items-center gap-2 text-sm font-bold text-white pb-3 border-b border-slate-800">
            <Database size={18} className="text-purple-400" />
            <span>Evaluation Storage Management</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handleExportData}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-colors"
            >
              <Download size={14} />
              <span>Export Evaluation Logs (JSON)</span>
            </button>

            <button
              type="button"
              onClick={handleClearData}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-medium border border-rose-500/30 transition-colors"
            >
              <Trash2 size={14} />
              <span>Clear Evaluation Logs</span>
            </button>
          </div>
        </div>

        {/* Save Button */}
        <div className="flex items-center justify-between pt-2">
          {saveSuccess ? (
            <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
              <CheckCircle2 size={16} />
              <span>Settings saved successfully!</span>
            </span>
          ) : (
            <span />
          )}

          <button
            type="submit"
            disabled={saving}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold shadow-glow transition-all disabled:opacity-50"
          >
            <Save size={15} />
            <span>{saving ? 'Saving Settings...' : 'Save Configuration'}</span>
          </button>
        </div>
      </form>
    </div>
  );
}
