import React, { useState } from 'react';
import { X, Key, Sliders, CheckCircle2, Sparkles } from 'lucide-react';
import type { VoiceSettings } from '../types';

interface VoiceSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  settings: VoiceSettings;
  onSave?: (newSettings: VoiceSettings) => void;
  onSaveSettings?: (newSettings: VoiceSettings) => void;
}

export const VoiceSettingsModal: React.FC<VoiceSettingsModalProps> = ({
  isOpen,
  onClose,
  settings,
  onSave,
  onSaveSettings
}) => {
  const [formState, setFormState] = useState<VoiceSettings>(settings);
  const [testSuccess, setTestSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    if (onSaveSettings) onSaveSettings(formState);
    if (onSave) onSave(formState);
    setTestSuccess(true);
    setTimeout(() => {
      setTestSuccess(false);
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="glass-panel w-full max-w-lg rounded-2xl border border-slate-700/60 p-6 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-brand-500/20 text-brand-400 rounded-xl border border-brand-500/30">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Voice & AI Preferences</h3>
              <p className="text-xs text-slate-400">Configure accents, audio pitch, rate, and AI API keys.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="space-y-5 text-xs">
          {/* Accent Choice */}
          <div className="space-y-2">
            <label className="font-bold text-slate-300 uppercase tracking-wider block">
              AI Voice Accent
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { id: 'en-US', label: '🇺🇸 American English' },
                { id: 'en-GB', label: '🇬🇧 British English' },
                { id: 'en-AU', label: '🇦🇺 Australian English' },
                { id: 'en-IN', label: '🇮🇳 Indian English' }
              ].map(acc => (
                <button
                  key={acc.id}
                  type="button"
                  onClick={() => setFormState({ ...formState, accent: acc.id as any })}
                  className={`p-2.5 rounded-xl border text-left font-semibold transition ${
                    formState.accent === acc.id
                      ? 'border-brand-500 bg-brand-500/15 text-white shadow-md'
                      : 'border-slate-800 bg-slate-900/60 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Speech Rate Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center font-bold text-slate-300 uppercase tracking-wider">
              <span>Speaking Speed Rate</span>
              <span className="text-brand-400 font-mono text-xs">{formState.rate}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.25"
              step="0.05"
              value={formState.rate}
              onChange={(e) => setFormState({ ...formState, rate: parseFloat(e.target.value) })}
              className="w-full accent-brand-500 cursor-pointer"
            />
          </div>

          {/* AI Provider & API Key */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-3">
            <div className="flex items-center space-x-2 text-slate-200 font-bold">
              <Key className="w-4 h-4 text-amber-400" />
              <span>AI Provider & API Key Configuration</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'mock', label: 'Smart Engine' },
                { id: 'openai', label: 'OpenAI GPT-4o' },
                { id: 'gemini', label: 'Google Gemini' }
              ].map(prov => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => setFormState({ ...formState, apiProvider: prov.id as any })}
                  className={`p-2 rounded-lg border text-center font-bold text-[11px] transition ${
                    formState.apiProvider === prov.id
                      ? 'border-accent-cyan bg-accent-cyan/15 text-accent-cyan'
                      : 'border-slate-800 bg-slate-950/60 text-slate-400'
                  }`}
                >
                  {prov.label}
                </button>
              ))}
            </div>

            {formState.apiProvider !== 'mock' && (
              <div className="space-y-1 pt-1">
                <input
                  type="password"
                  placeholder={`Enter your ${formState.apiProvider === 'openai' ? 'OpenAI (sk-...)' : 'Gemini'} API key...`}
                  value={formState.apiKey}
                  onChange={(e) => setFormState({ ...formState, apiKey: e.target.value })}
                  className="w-full p-2.5 rounded-lg bg-slate-950 border border-slate-700 text-white placeholder-slate-500 font-mono text-xs focus:outline-none focus:border-brand-500"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 border-t border-slate-800 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-800 bg-slate-900 text-slate-300 text-xs font-bold hover:text-white"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 text-white text-xs font-bold flex items-center space-x-2 shadow-lg shadow-brand-500/25 hover:opacity-95"
          >
            {testSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Saved Preferences!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Save Voice Settings</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
