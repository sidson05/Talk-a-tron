import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Brain, Mic, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import type { CognitiveQuestion } from '../types';
import { AptitudeChartVisualizer } from './AptitudeChartVisualizer';

interface CognitiveDetailModalProps {
  question: CognitiveQuestion | null;
  isOpen: boolean;
  onClose: () => void;
  onSelectAndStart: (q: CognitiveQuestion) => void;
}

export const CognitiveDetailModal: React.FC<CognitiveDetailModalProps> = ({
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
              <Brain className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-200 text-slate-800">
                  {question.modeCategory}
                </span>
                <span className="text-xs font-bold text-amber-700">
                  {question.level}
                </span>
              </div>
              <h3 className="text-sm md:text-base font-extrabold text-slate-900 mt-0.5 leading-snug">{question.title}</h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Question Content Area */}
        <div className="overflow-y-auto pr-1 space-y-3 max-h-[52vh] flex-1">
          {/* Question Prompt */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-slate-900 text-xs md:text-sm leading-relaxed font-medium shadow-xs">
            "{question.question}"
          </div>

          {/* Interactive Chart Display if Aptitude + Verbal Mode */}
          {question.chartData && (
            <AptitudeChartVisualizer chartData={question.chartData} />
          )}

          {/* Evaluation Criteria Checklist */}
          <div className="space-y-2 pt-1">
            <div className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center space-x-1.5">
              <HelpCircle className="w-4 h-4 text-slate-900" />
              <span>AI Evaluation Benchmark Criteria</span>
            </div>
            <ul className="space-y-1.5 text-xs text-slate-700 font-semibold">
              {question.keyEvaluationCriteria.map((crit, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{crit}</span>
                </li>
              ))}
            </ul>
          </div>
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
            <span>Select Challenge & Record Voice</span>
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};
