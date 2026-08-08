import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Target, Mic, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import type { InterviewQuestion } from '../types';

interface InterviewDetailModalProps {
  question: InterviewQuestion | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAndStart: (q: InterviewQuestion) => void;
}

export const InterviewDetailModal: React.FC<InterviewDetailModalProps> = ({
  question,
  isOpen,
  onClose,
  onSelectAndStart
}) => {
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

  if (!isOpen || !question) return null;

  return createPortal(
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 bg-slate-900/65 backdrop-blur-md animate-fadeIn overflow-hidden"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      <div className="glass-card bg-white/95 text-slate-900 w-full max-w-lg rounded-3xl p-5 sm:p-6 shadow-2xl space-y-4 border border-white/90 max-h-[88vh] flex flex-col justify-between my-auto animate-scaleUp">
        {/* Modal Header */}
        <div className="flex items-start justify-between border-b border-slate-200 pb-3 shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-slate-900 text-white rounded-2xl shadow-xs shrink-0">
              <Target className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-200 text-slate-800">
                  {question.role}
                </span>
                <span className="text-xs font-bold text-amber-700">
                  {question.category}
                </span>
              </div>
              <h3 className="text-sm md:text-base font-extrabold text-slate-900 mt-0.5 leading-snug">{question.question}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable STAR Tips Content Area */}
        <div className="overflow-y-auto pr-1 space-y-3 max-h-[52vh] flex-1">
          <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
            <HelpCircle className="w-4 h-4 text-slate-900" />
            <span>Recommended STAR Structuring Checklist</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
            {[
              { tag: 'S', title: 'Situation', text: question.starTips.situation },
              { tag: 'T', title: 'Task', text: question.starTips.task },
              { tag: 'A', title: 'Action', text: question.starTips.action },
              { tag: 'R', title: 'Result', text: question.starTips.result }
            ].map(item => (
              <div key={item.tag} className="p-3 rounded-2xl bg-slate-50 border border-slate-200 space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="w-5 h-5 rounded-md text-[10px] font-extrabold flex items-center justify-center bg-slate-900 text-white">
                    {item.tag}
                  </span>
                  <span className="text-xs font-bold text-slate-900">{item.title}</span>
                </div>
                <p className="text-[11px] text-slate-600 leading-snug font-medium pl-7">
                  {item.text}
                </p>
              </div>
            ))}
          </div>

          {/* Model Answer Hint */}
          {question.modelAnswer && (
            <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs flex items-center space-x-2 font-semibold">
              <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0" />
              <span>An executive exemplar model answer will be unlocked after you submit your response!</span>
            </div>
          )}
        </div>

        {/* Modal Actions Footer */}
        <div className="flex items-center justify-end space-x-2.5 border-t border-slate-200 pt-3 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-full border border-slate-300 text-slate-700 text-xs font-bold hover:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => {
              onSelectAndStart(question);
              onClose();
            }}
            className="btn-dark px-5 py-2 rounded-full text-xs font-bold flex items-center space-x-1.5 shadow-md"
          >
            <Mic className="w-3.5 h-3.5 text-emerald-400" />
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Select Question & Record Voice</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
