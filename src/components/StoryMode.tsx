import React, { useState, useRef } from 'react';
import { BookOpen, RefreshCw, CheckCircle } from 'lucide-react';
import type { StoryPrompt, SpeechFeedback, VoiceSettings } from '../types';
import { STORY_PROMPTS } from '../data/mockData';
import { VoiceRecorderHero } from './VoiceRecorderHero';
import { FeedbackCard } from './FeedbackCard';
import { StoryDetailModal } from './StoryDetailModal';
import { aiService } from '../services/aiService';

interface StoryModeProps {
  settings: VoiceSettings;
  onSessionComplete: (feedback: SpeechFeedback) => void;
}

export const StoryMode: React.FC<StoryModeProps> = ({ settings, onSessionComplete }) => {
  const [selectedStory, setSelectedStory] = useState<StoryPrompt>(STORY_PROMPTS[0]);
  const [categoryFilter, setCategoryFilter] = useState<string>('All');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentFeedback, setCurrentFeedback] = useState<SpeechFeedback | null>(null);

  // Popup Modal State
  const [modalStory, setModalStory] = useState<StoryPrompt | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const recorderRef = useRef<HTMLDivElement | null>(null);
  const categories = ['All', 'Business & Tech', 'Leadership', 'Daily Life', 'Creative', 'Philosophy'];

  const filteredStories = categoryFilter === 'All'
    ? STORY_PROMPTS
    : STORY_PROMPTS.filter(s => s.category === categoryFilter);

  const handleRandomize = () => {
    const nextIndex = Math.floor(Math.random() * STORY_PROMPTS.length);
    const chosen = STORY_PROMPTS[nextIndex];
    setSelectedStory(chosen);
    setModalStory(chosen);
    setIsModalOpen(true);
    setCurrentFeedback(null);
  };

  const handleOpenStoryModal = (story: StoryPrompt) => {
    setModalStory(story);
    setIsModalOpen(true);
  };

  const handleSelectStoryAndScroll = (story: StoryPrompt) => {
    setSelectedStory(story);
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
        'story',
        settings,
        selectedStory.title,
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
            <BookOpen className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Daily Story Coach</h2>
            <p className="text-xs text-slate-600 font-medium">Click any story card to open its detail popup, listen to AI narration, or practice retelling.</p>
          </div>
        </div>

        <button
          onClick={handleRandomize}
          className="btn-dark px-4 py-2 rounded-full text-xs font-bold flex items-center space-x-2 self-start md:self-auto shadow-md"
        >
          <RefreshCw className="w-3.5 h-3.5 text-emerald-400" />
          <span>New Random Story</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div className="flex items-center space-x-2 overflow-x-auto pb-1 no-scrollbar">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setCategoryFilter(cat)}
            className={`px-4 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition ${
              categoryFilter === cat
                ? 'glass-pill-active'
                : 'bg-white/80 text-slate-700 hover:text-slate-900 hover:bg-white border border-slate-300/80 shadow-xs'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Uniform Light Glass Cards Grid (Consistent Theme!) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredStories.map(story => {
          const isSelected = selectedStory.id === story.id;
          return (
            <div
              key={story.id}
              onClick={() => handleOpenStoryModal(story)}
              className={`p-5 rounded-2xl border cursor-pointer transition-all duration-200 space-y-3 glass-card glass-card-hover ${
                isSelected
                  ? 'border-slate-900 ring-2 ring-slate-900/20 bg-white/95 shadow-md'
                  : 'bg-white/75 border-slate-200/90 hover:bg-white'
              }`}
            >
              <div className="flex items-center justify-between text-[11px]">
                <div className="flex items-center space-x-1.5">
                  <span className="px-2.5 py-0.5 rounded-full font-bold uppercase bg-slate-100 text-slate-800 border border-slate-200">
                    {story.category}
                  </span>
                  {isSelected && (
                    <span className="flex items-center space-x-1 text-slate-900 font-extrabold">
                      <CheckCircle className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-[10px]">Active</span>
                    </span>
                  )}
                </div>
                <span className={`font-bold ${
                  story.difficulty === 'Advanced' ? 'text-rose-600' : story.difficulty === 'Intermediate' ? 'text-amber-600' : 'text-emerald-600'
                }`}>
                  {story.difficulty}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 leading-snug">{story.title}</h4>
              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed font-medium">{story.text}</p>
              
              <div className="text-[11px] font-bold text-slate-800 pt-1 flex items-center space-x-1">
                <span>Click to view details & practice →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Microphone Hero Recorder Anchor */}
      <div ref={recorderRef}>
        <VoiceRecorderHero
          modeLabel="Story"
          speakingTask={selectedStory.speakingTask}
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

      {/* Popup Detail Modal */}
      <StoryDetailModal
        story={modalStory}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSelectAndStart={handleSelectStoryAndScroll}
        settings={settings}
      />
    </div>
  );
};
