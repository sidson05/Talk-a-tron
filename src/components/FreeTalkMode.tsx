import React, { useState } from 'react';
import { MessageSquare, Lightbulb } from 'lucide-react';
import type { SpeechFeedback, VoiceSettings } from '../types';
import { VoiceRecorderHero } from './VoiceRecorderHero';
import { FeedbackCard } from './FeedbackCard';
import { aiService } from '../services/aiService';

interface FreeTalkModeProps {
  settings: VoiceSettings;
  onSessionComplete: (feedback: SpeechFeedback) => void;
}

export const FreeTalkMode: React.FC<FreeTalkModeProps> = ({ settings, onSessionComplete }) => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<SpeechFeedback | null>(null);

  const promptIdeas = [
    "Describe your career goals and what kind of project excites you most.",
    "Explain how you prioritize tasks when managing multiple competing deadlines.",
    "Talk about a recent technology trend or book that inspired you.",
    "Practice presenting your 60-second elevator pitch."
  ];

  const handleAnalyzeSpeech = async (transcript: string, userAudioUrl?: string) => {
    setIsAnalyzing(true);
    try {
      const feedback = await aiService.analyzeSpeech(
        transcript,
        'free',
        settings,
        'Free-Form Practice',
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
      {/* Banner Header */}
      <div className="glass-card p-6 rounded-3xl border border-white/80 space-y-4 shadow-sm">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-sm shrink-0">
            <MessageSquare className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Free-Talk Speaking Practice</h2>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">Speak freely on any topic. Talk-a-Tron will detect grammatical errors, suggest executive vocabulary, and boost your overall fluency.</p>
          </div>
        </div>

        {/* Prompt Suggestions */}
        <div className="space-y-2.5 pt-3 border-t border-slate-200">
          <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider flex items-center space-x-1.5">
            <Lightbulb className="w-4 h-4 text-amber-600" />
            <span>Need inspiration? Try talking about one of these:</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {promptIdeas.map((idea, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-slate-200 text-xs font-semibold text-slate-800 shadow-xs hover:border-slate-400 hover:shadow-sm transition"
              >
                💡 {idea}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Hero Voice Recorder */}
      <VoiceRecorderHero
        modeLabel="Free Talk"
        speakingTask="Speak naturally for 30-60 seconds on any topic you choose"
        defaultAccent={settings.accent}
        apiKey={settings.apiKey}
        onAnalyze={handleAnalyzeSpeech}
        isAnalyzing={isAnalyzing}
      />

      {/* Feedback Output */}
      {currentFeedback && (
        <FeedbackCard feedback={currentFeedback} settings={settings} />
      )}
    </div>
  );
};
