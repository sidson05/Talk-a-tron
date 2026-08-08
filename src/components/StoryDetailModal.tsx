import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Volume2, MessageCircle, Mic, Sparkles, BookOpen } from 'lucide-react';
import type { StoryPrompt, VoiceSettings } from '../types';
import { speechEngine } from '../services/speech';

interface StoryDetailModalProps {
  story: StoryPrompt | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAndStart: (story: StoryPrompt) => void;
  settings: VoiceSettings;
}

export const StoryDetailModal: React.FC<StoryDetailModalProps> = ({
  story,
  isOpen,
  onClose,
  onSelectAndStart,
  settings
}) => {
  const [isReading, setIsReading] = useState(false);

  // Lock background scroll when popup is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen || !story) return null;

  const handleReadAloud = () => {
    setIsReading(true);
    speechEngine.speak(story.text, {
      accent: settings.accent,
      rate: settings.rate,
      pitch: settings.pitch,
      onEnd: () => setIsReading(false)
    });
  };

  const handleStartPractice = () => {
    speechEngine.stopSpeaking();
    setIsReading(false);
    onSelectAndStart(story);
    onClose();
  };

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/65 backdrop-blur-md animate-fadeIn overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          speechEngine.stopSpeaking();
          onClose();
        }
      }}
    >
      <div className="glass-card bg-white/95 text-slate-900 w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 border border-white/90 max-h-[88vh] flex flex-col justify-between my-auto animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-xs shrink-0">
              <BookOpen className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-200 text-slate-800">
                  {story.category}
                </span>
                <span className={`text-xs font-bold ${
                  story.difficulty === 'Advanced' ? 'text-rose-600' : story.difficulty === 'Intermediate' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {story.difficulty} Level
                </span>
              </div>
              <h3 className="text-base md:text-lg font-extrabold text-slate-900 mt-0.5">{story.title}</h3>
            </div>
          </div>

          <button
            onClick={() => {
              speechEngine.stopSpeaking();
              onClose();
            }}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Story Content Area */}
        <div className="overflow-y-auto pr-1 space-y-3.5 max-h-[52vh] flex-1">
          {/* Story Context & TTS Trigger */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Story Context</span>
              <button
                type="button"
                onClick={handleReadAloud}
                className={`px-3 py-1 rounded-full text-xs font-bold flex items-center space-x-1.5 transition ${
                  isReading
                    ? 'bg-slate-900 text-emerald-400 animate-pulse'
                    : 'bg-slate-100 border border-slate-300 text-slate-800 hover:bg-slate-200'
                }`}
              >
                <Volume2 className="w-3.5 h-3.5 text-slate-800" />
                <span>{isReading ? 'Reading Story Aloud...' : 'Listen to AI Narration'}</span>
              </button>
            </div>

            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-800 text-xs md:text-sm leading-relaxed font-medium">
              {story.text}
            </div>
          </div>

          {/* Daily Speaking Task Prompt */}
          <div className="p-3.5 rounded-2xl bg-slate-900 text-white flex items-start space-x-3 shadow-sm">
            <MessageCircle className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <div>
              <div className="text-[10px] font-extrabold uppercase tracking-wider text-emerald-400">Your Daily Speaking Task</div>
              <div className="text-xs font-semibold text-slate-100 mt-0.5">{story.speakingTask}</div>
            </div>
          </div>
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-end space-x-2.5 border-t border-slate-200 pt-3 shrink-0">
          <button
            type="button"
            onClick={() => {
              speechEngine.stopSpeaking();
              onClose();
            }}
            className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleStartPractice}
            className="btn-dark px-5 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-md"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Select Story & Record Voice</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
