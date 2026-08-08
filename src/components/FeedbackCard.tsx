import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, CheckCircle2, AlertTriangle, ArrowRight, Volume2, ShieldCheck, Target, Info, Mic, Star, Brain } from 'lucide-react';
import confetti from 'canvas-confetti';
import type { SpeechFeedback, VoiceSettings } from '../types';
import { speechEngine } from '../services/speech';

interface FeedbackCardProps {
  feedback: SpeechFeedback;
  settings: VoiceSettings;
}

export const FeedbackCard: React.FC<FeedbackCardProps> = ({ feedback, settings }) => {
  const [activeTab, setActiveTab] = useState<'grammar' | 'advanced' | 'star' | 'cognitive'>(
    feedback.mode === 'cognitive' && feedback.cognitiveScorecard
      ? 'cognitive'
      : feedback.mode === 'interview' && feedback.starAnalysis
      ? 'star'
      : 'grammar'
  );
  const [isPlayingTTS, setIsPlayingTTS] = useState(false);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const [isPlayingModelAnswer, setIsPlayingModelAnswer] = useState(false);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  // Play subtle audio chime using Web Audio API on mount
  useEffect(() => {
    try {
      const audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, audioCtx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.15);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + 0.3);
    } catch (e) {
      // ignore
    }

    if (feedback.fluencyScore >= 85) {
      try {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.6 }
        });
      } catch (e) {
        // ignore
      }
    }

    if (settings.autoPlayTTS) {
      handlePlayTTS(feedback.correctedText);
    }
  }, [feedback]);

  const handlePlayTTS = (text: string) => {
    setIsPlayingTTS(true);
    speechEngine.speak(text, {
      accent: settings.accent,
      rate: settings.rate,
      pitch: settings.pitch,
      onEnd: () => setIsPlayingTTS(false)
    });
  };

  const handlePlayModelAnswer = (modelAns: string) => {
    setIsPlayingModelAnswer(true);
    speechEngine.speak(`Here is the step by step solution analysis. ${modelAns}`, {
      accent: settings.accent,
      rate: settings.rate,
      pitch: settings.pitch,
      onEnd: () => setIsPlayingModelAnswer(false)
    });
  };

  const handlePlayUserAudio = () => {
    if (!feedback.userAudioUrl) return;

    if (!userAudioPlayerRef.current) {
      userAudioPlayerRef.current = new Audio(feedback.userAudioUrl);
      userAudioPlayerRef.current.onended = () => setIsPlayingUserAudio(false);
    }

    if (isPlayingUserAudio) {
      userAudioPlayerRef.current.pause();
      setIsPlayingUserAudio(false);
    } else {
      userAudioPlayerRef.current.play().then(() => {
        setIsPlayingUserAudio(true);
      }).catch(err => console.error(err));
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-emerald-700 border-emerald-300 bg-emerald-50';
    if (score >= 70) return 'text-amber-700 border-amber-300 bg-amber-50';
    return 'text-rose-700 border-rose-300 bg-rose-50';
  };

  return (
    <div className="w-full glass-card rounded-3xl border border-white/90 p-6 md:p-8 space-y-6 shadow-xl animate-fadeIn text-slate-900">
      {/* Top Banner Score & Dual Audio Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div className="flex items-center space-x-4">
          {/* Fluency Score Badge */}
          <div className={`p-4 rounded-2xl border text-center ${getScoreColor(feedback.fluencyScore)} shadow-xs`}>
            <div className="text-2xl font-extrabold font-sans leading-none">{feedback.fluencyScore}</div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider mt-1 opacity-90">Fluency Score</div>
          </div>

          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center p-1 border border-slate-700 shadow-sm shrink-0">
              <img src="/robot_assistant.svg" alt="Talk-a-Tron Robot Assistant" className="w-7 h-7 object-contain" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-extrabold text-slate-900">AI Feedback & Analysis</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-900 text-white">
                  {feedback.mode}
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5 font-semibold">
                Analyzed {feedback.grammarErrors.length} grammatical fix{feedback.grammarErrors.length !== 1 ? 'es' : ''} & {feedback.vocabularyUpgrades.length} vocabulary upgrade{feedback.vocabularyUpgrades.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>

        {/* Audio Listen Buttons (User Recording vs AI Voice) */}
        <div className="flex flex-wrap items-center gap-2">
          {feedback.userAudioUrl && (
            <button
              onClick={handlePlayUserAudio}
              className={`px-4 py-2 rounded-full border text-xs font-bold flex items-center space-x-2 transition ${
                isPlayingUserAudio
                  ? 'border-slate-900 bg-slate-900 text-white animate-pulse'
                  : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
              }`}
            >
              <Mic className="w-4 h-4 text-emerald-600" />
              <span>{isPlayingUserAudio ? 'Playing Your Recording...' : 'Play My Recording'}</span>
            </button>
          )}

          <button
            onClick={() => handlePlayTTS(feedback.correctedText)}
            className={`px-4 py-2 rounded-full border text-xs font-bold flex items-center space-x-2 transition ${
              isPlayingTTS
                ? 'bg-slate-900 text-emerald-400 border-slate-900 animate-pulse'
                : 'btn-dark'
            }`}
          >
            <Volume2 className="w-4 h-4 text-emerald-400" />
            <span>{isPlayingTTS ? 'Playing AI Correction...' : 'Listen to AI Voice'}</span>
          </button>
        </div>
      </div>

      {/* Corrected & Original Speech Box */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white border border-slate-200 space-y-1.5 shadow-xs">
          <div className="text-xs font-bold text-slate-600 uppercase tracking-wider flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-slate-500" /> Original Spoken Text
          </div>
          <p className="text-sm text-slate-800 leading-relaxed font-sans italic font-medium">
            "{feedback.originalTranscript}"
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-1.5 shadow-md">
          <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AI Corrected Text
          </div>
          <p className="text-sm text-slate-100 font-semibold leading-relaxed font-sans">
            "{feedback.correctedText}"
          </p>
        </div>
      </div>

      {/* View Tabs */}
      <div className="flex border-b border-slate-200 gap-2 overflow-x-auto no-scrollbar">
        {feedback.cognitiveScorecard && (
          <button
            onClick={() => setActiveTab('cognitive')}
            className={`px-4 py-2 text-xs font-bold rounded-full transition ${
              activeTab === 'cognitive'
                ? 'glass-pill-active'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Brain className="w-4 h-4 inline mr-1.5" />
            <span>Cognitive Rubric ({feedback.cognitiveScorecard.overallScore}%)</span>
          </button>
        )}

        {feedback.starAnalysis && (
          <button
            onClick={() => setActiveTab('star')}
            className={`px-4 py-2 text-xs font-bold rounded-full transition ${
              activeTab === 'star'
                ? 'glass-pill-active'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Target className="w-4 h-4 inline mr-1.5" />
            <span>STAR Rubric ({feedback.starAnalysis.overallScore}%)</span>
          </button>
        )}

        <button
          onClick={() => setActiveTab('grammar')}
          className={`px-4 py-2 text-xs font-bold rounded-full transition ${
            activeTab === 'grammar'
              ? 'glass-pill-active'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <AlertTriangle className="w-4 h-4 inline mr-1.5 text-amber-500" />
          <span>Grammar Fixes ({feedback.grammarErrors.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('advanced')}
          className={`px-4 py-2 text-xs font-bold rounded-full transition ${
            activeTab === 'advanced'
              ? 'glass-pill-active'
              : 'text-slate-600 hover:text-slate-900'
          }`}
        >
          <Sparkles className="w-4 h-4 inline mr-1.5 text-purple-600" />
          <span>Vocabulary Upgrades ({feedback.vocabularyUpgrades.length})</span>
        </button>
      </div>

      {/* Tab: Cognitive Rubric & Step-by-Step Solution Breakdown */}
      {activeTab === 'cognitive' && feedback.cognitiveScorecard && (
        <div className="space-y-6 animate-fadeIn">
          {/* AI Debate Counter-Challenge Box if AI Debate Mode */}
          {feedback.cognitiveScorecard.aiCounterargument && (
            <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-2 shadow-xs">
              <div className="flex items-center space-x-2 text-rose-800 font-extrabold text-xs uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-rose-600" />
                <span>AI Debate Counter-Challenge</span>
              </div>
              <p className="text-sm text-slate-800 font-medium italic leading-relaxed">
                {feedback.cognitiveScorecard.aiCounterargument}
              </p>
            </div>
          )}

          {/* 10-Skill Rubric Scores Grid */}
          <div className="space-y-3">
            <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider text-slate-700">
              <span>10-Skill Cognitive Competency Rubric</span>
              <span className="text-slate-900 font-extrabold">Next Level: {feedback.cognitiveScorecard.nextRecommendedLevel}</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {[
                { label: 'Logical Reasoning', score: feedback.cognitiveScorecard.rubric.logicalReasoning },
                { label: 'Critical Thinking', score: feedback.cognitiveScorecard.rubric.criticalThinking },
                { label: 'Problem Solving', score: feedback.cognitiveScorecard.rubric.problemSolving },
                { label: 'Communication', score: feedback.cognitiveScorecard.rubric.communication },
                { label: 'Vocabulary', score: feedback.cognitiveScorecard.rubric.vocabulary },
                { label: 'Grammar', score: feedback.cognitiveScorecard.rubric.grammar },
                { label: 'Confidence', score: feedback.cognitiveScorecard.rubric.confidence },
                { label: 'Fluency', score: feedback.cognitiveScorecard.rubric.fluency }
              ].map(item => (
                <div key={item.label} className="p-3 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-xs">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-slate-800 truncate">{item.label}</span>
                    <span className="font-extrabold text-slate-900 font-mono">{item.score.toFixed(1)}/10</span>
                  </div>
                  <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-slate-900 rounded-full"
                      style={{ width: `${item.score * 10}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Step-by-Step Solution Breakdown */}
          {feedback.cognitiveScorecard.stepByStepSolution && (
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-3 shadow-md">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-400">Step-by-Step Ideal Solution Analysis</span>
                <button
                  onClick={() => handlePlayModelAnswer(feedback.cognitiveScorecard!.stepByStepSolution!)}
                  className="text-xs text-emerald-400 hover:text-white flex items-center space-x-1 font-bold"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Listen</span>
                </button>
              </div>
              <p className="text-xs text-slate-200 leading-relaxed font-sans whitespace-pre-line font-medium">
                {feedback.cognitiveScorecard.stepByStepSolution}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tab: STAR Interview Breakdown */}
      {activeTab === 'star' && feedback.starAnalysis && (
        <div className="space-y-6 animate-fadeIn">
          {feedback.starAnalysis.modelAnswer && (
            <div className="p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 space-y-4 shadow-md">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-3">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-amber-400 fill-amber-400 animate-pulse" />
                  <h4 className="text-base font-extrabold text-white">Ideal Exemplar STAR Model Answer</h4>
                </div>

                <button
                  onClick={() => handlePlayModelAnswer(feedback.starAnalysis!.modelAnswer!)}
                  className={`px-4 py-1.5 rounded-full text-xs font-bold transition shadow-sm ${
                    isPlayingModelAnswer ? 'bg-emerald-400 text-slate-900 animate-pulse' : 'bg-white text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Volume2 className="w-3.5 h-3.5 inline mr-1" />
                  <span>{isPlayingModelAnswer ? 'Reading...' : 'Listen'}</span>
                </button>
              </div>

              <div className="p-4 rounded-xl bg-slate-800/80 border border-slate-700 text-slate-100 text-xs leading-relaxed whitespace-pre-line font-medium">
                {feedback.starAnalysis.modelAnswer}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 1: Grammar Errors */}
      {activeTab === 'grammar' && (
        <div className="space-y-3 animate-fadeIn">
          {feedback.grammarErrors.length === 0 ? (
            <div className="p-6 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-center space-y-1 font-semibold">
              <CheckCircle2 className="w-8 h-8 mx-auto text-emerald-600" />
              <div className="font-bold text-sm">Flawless Grammar!</div>
              <div className="text-xs opacity-80">No grammatical errors detected in this speech sample.</div>
            </div>
          ) : (
            feedback.grammarErrors.map((err, idx) => (
              <div
                key={err.id || idx}
                className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-amber-100 text-amber-800 border border-amber-200">
                    {err.type}
                  </span>
                </div>

                <div className="flex items-center space-x-3 text-sm pt-1">
                  <span className="line-through text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md font-semibold">
                    {err.original}
                  </span>
                  <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                  <span className="font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                    {err.replacement}
                  </span>
                </div>

                <p className="text-xs text-slate-600 pt-1 leading-relaxed font-medium">
                  💡 {err.explanation}
                </p>
              </div>
            ))
          )}
        </div>
      )}

      {/* Tab 2: Advanced Vocabulary Upgrades */}
      {activeTab === 'advanced' && (
        <div className="space-y-3 animate-fadeIn">
          {feedback.vocabularyUpgrades.map((upg, idx) => (
            <div
              key={upg.id || idx}
              className="p-4 rounded-2xl bg-white border border-slate-200 space-y-2 shadow-xs"
            >
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-purple-100 text-purple-800 border border-purple-200">
                  {upg.registerLevel} Phrasing
                </span>
                <button
                  onClick={() => handlePlayTTS(`Instead of ${upg.original}, use ${upg.upgraded}`)}
                  className="text-xs text-purple-700 font-bold hover:text-purple-900 flex items-center space-x-1"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                  <span>Pronounce</span>
                </button>
              </div>

              <div className="flex items-center space-x-3 text-sm pt-1">
                <span className="text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                  "{upg.original}"
                </span>
                <ArrowRight className="w-4 h-4 text-slate-400 shrink-0" />
                <span className="font-bold text-purple-900 bg-purple-50 px-2.5 py-0.5 rounded-md border border-purple-200">
                  "{upg.upgraded}"
                </span>
              </div>

              <p className="text-xs text-slate-700 pt-1 leading-relaxed font-medium">
                ✨ <strong className="text-purple-900">Why it's better:</strong> {upg.explanation}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
