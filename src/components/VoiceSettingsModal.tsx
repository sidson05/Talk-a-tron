import React, { useState } from 'react';
import { X, Key, Sliders, CheckCircle2, Sparkles, Globe, Volume2 } from 'lucide-react';
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-fadeIn">
      <div className="glass-card w-full max-w-lg rounded-3xl border border-white/95 p-6 md:p-8 shadow-2xl space-y-6 text-slate-900 bg-white/95">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-sm">
              <Sliders className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-extrabold text-slate-900">Voice & Glass Preferences</h3>
              <p className="text-xs text-slate-600 font-semibold mt-0.5">Customize AI accents, speech rate, and glassmorphism styling.</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Form */}
        <div className="space-y-5 text-xs">
          {/* Accent Choice */}
          <div className="space-y-2">
            <label className="font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
              <Globe className="w-3.5 h-3.5 text-emerald-600" />
              <span>AI Voice Accent</span>
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
                  className={`p-3 rounded-2xl border text-left font-bold transition shadow-2xs ${
                    formState.accent === acc.id
                      ? 'border-slate-900 bg-slate-900 text-white shadow-md'
                      : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-50'
                  }`}
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>

          {/* Speech Rate Slider */}
          <div className="space-y-2 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <div className="flex justify-between items-center font-extrabold text-slate-900 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-slate-700" />
                <span>Speaking Speed Rate</span>
              </span>
              <span className="text-slate-900 font-mono text-xs px-2 py-0.5 rounded bg-slate-200">{formState.rate}x</span>
            </div>
            <input
              type="range"
              min="0.75"
              max="1.25"
              step="0.05"
              value={formState.rate}
              onChange={(e) => setFormState({ ...formState, rate: parseFloat(e.target.value) })}
              className="w-full accent-slate-900 cursor-pointer"
            />
          </div>

          {/* AI Provider & API Key */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-2xs">
            <div className="flex items-center space-x-2 text-slate-900 font-extrabold">
              <Key className="w-4 h-4 text-amber-500" />
              <span>AI Engine Provider</span>
            </div>

            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'mock', label: 'Smart Engine' },
                { id: 'gemini', label: 'Google Gemini' },
                { id: 'openai', label: 'OpenAI GPT-4' }
              ].map(prov => (
                <button
                  key={prov.id}
                  type="button"
                  onClick={() => setFormState({ ...formState, apiProvider: prov.id as any })}
                  className={`p-2.5 rounded-xl border text-center font-extrabold text-[11px] transition ${
                    formState.apiProvider === prov.id
                      ? 'border-emerald-600 bg-emerald-50 text-emerald-900 shadow-2xs'
                      : 'border-slate-300 bg-white text-slate-700 hover:bg-slate-50'
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
                  className="w-full p-3 rounded-xl bg-slate-50 border border-slate-300 text-slate-900 placeholder-slate-400 font-mono text-xs focus:outline-none focus:border-slate-900"
                />
              </div>
            )}
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end space-x-3 border-t border-slate-200 pt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-full border border-slate-300 bg-white text-slate-700 text-xs font-extrabold hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleSave}
            className="btn-dark px-6 py-2.5 rounded-full text-xs font-extrabold flex items-center space-x-2 shadow-lg"
          >
            {testSuccess ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>Preferences Saved!</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-emerald-400" />
                <span>Save Preferences</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
