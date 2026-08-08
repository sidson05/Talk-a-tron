import React, { useState, useRef } from 'react';
import { Brain, RefreshCw, CheckCircle } from 'lucide-react';
import type { CognitiveQuestion, SpeechFeedback, VoiceSettings } from '../types';
import { COGNITIVE_QUESTIONS } from '../data/cognitiveData';
import { VoiceRecorderHero } from './VoiceRecorderHero';
import { FeedbackCard } from './FeedbackCard';
import { CognitiveDetailModal } from './CognitiveDetailModal';
import { aiService } from '../services/aiService';

interface CognitiveLabProps {
  settings: VoiceSettings;
  onSessionComplete: (feedback: SpeechFeedback) => void;
}

export const CognitiveLab: React.FC<CognitiveLabProps> = ({ settings, onSessionComplete }) => {
  const [selectedQuestion, setSelectedQuestion] = useState<CognitiveQuestion>(COGNITIVE_QUESTIONS[0]);
  const [trackFilter, setTrackFilter] = useState<string>('All');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<SpeechFeedback | null>(null);

  // Popup Modal State
  const [modalQuestion, setModalQuestion] = useState<CognitiveQuestion | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const recorderRef = useRef<HTMLDivElement | null>(null);
  const tracks = ['All', 'Logical & Aptitude', 'Debate & Verbal', 'Tech & Product Strategy', 'Leadership & Judgment'];

  const filteredQuestions = trackFilter === 'All'
    ? COGNITIVE_QUESTIONS
    : COGNITIVE_QUESTIONS.filter(q => q.modeCategory === trackFilter);

  const handleRandomQuestion = () => {
    const nextIdx = Math.floor(Math.random() * COGNITIVE_QUESTIONS.length);
    const chosen = COGNITIVE_QUESTIONS[nextIdx];
    setSelectedQuestion(chosen);
    setModalQuestion(chosen);
    setIsModalOpen(true);
    setCurrentFeedback(null);
  };

  const handleOpenModal = (q: CognitiveQuestion) => {
    setModalQuestion(q);
    setIsModalOpen(true);
  };

  const handleSelectQuestionAndScroll = (q: CognitiveQuestion) => {
    setSelectedQuestion(q);
    setCurrentFeedback(null);
    if (recorderRef.current) {
      recorderRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleAnalyzeSpeech = async (transcript: string, userAudioUrl?: string) => {
    setIsAnalyzing(true);
    try {
      const feedback = await aiService.analyzeSpeech(
        transcript,
        'cognitive',
        settings,
        selectedQuestion.title,
        userAudioUrl
      );
      setCurrentFeedback(feedback);
      onSessionComplete(feedback);
    } catch (err) {
      console.error(err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn w-full mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-white/80">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-sm shrink-0">
            <Brain className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Cognitive & Reasoning Lab</h2>
            <p className="text-xs text-slate-600 font-medium">Master technical logic, Fermi estimates, case studies, and AI debate challenges.</p>
          </div>
        </div>

        <button
          onClick={handleRandomQuestion}
          className="btn-dark px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-2 self-start md:self-auto shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>Random Challenge</span>
        </button>
      </div>

      {/* Track Category Selector Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {tracks.map(t => (
          <button
            key={t}
            onClick={() => setTrackFilter(t)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              trackFilter === t
                ? 'glass-pill-active'
                : 'bg-white/80 text-slate-700 hover:text-slate-900 hover:bg-white border border-slate-300/80 shadow-xs'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Uniform Light Glass Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredQuestions.map(q => {
          const isSelected = selectedQuestion.id === q.id;
          return (
            <div
              key={q.id}
              onClick={() => handleOpenModal(q)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 space-y-3 glass-card glass-card-hover ${
                isSelected
                  ? 'border-slate-900 ring-2 ring-slate-900/20 bg-white/95 shadow-md'
                  : 'bg-white/75 border-slate-200/90 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <span className="px-2.5 py-0.5 rounded-full font-bold uppercase bg-slate-100 text-slate-800 border border-slate-200">
                    {q.modeCategory}
                  </span>
                  {isSelected && (
                    <span className="flex items-center space-x-1 text-slate-900 font-extrabold">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px]">Active</span>
                    </span>
                  )}
                </div>
                <span className="font-bold text-amber-700">{q.level}</span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug">{q.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">{q.question}</p>

              <div className="text-[11px] font-bold text-slate-800 pt-1 flex items-center space-x-1">
                <span>View Challenge & Practice →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Voice Recorder Anchor */}
      <div ref={recorderRef}>
        <VoiceRecorderHero
          modeLabel="Cognitive Lab"
          speakingTask={`Reason aloud: "${selectedQuestion.question}"`}
          defaultAccent={settings.accent}
          apiKey={settings.apiKey}
          onAnalyze={handleAnalyzeSpeech}
          isAnalyzing={isAnalyzing}
        />
      </div>

      {/* Feedback Card Output */}
      {currentFeedback && (
        <FeedbackCard feedback={currentFeedback} settings={settings} />
      )}

      {/* Detail Modal Popup */}
      <CognitiveDetailModal
        question={modalQuestion}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectAndStart={handleSelectQuestionAndScroll}
      />
    </div>
  );
};
