import { useState, useEffect } from 'react';
import type { PracticeMode, SpeechFeedback, UserStats, VoiceSettings } from './types';
import { Navbar } from './components/Navbar';
import { StoryMode } from './components/StoryMode';
import { InterviewMode } from './components/InterviewMode';
import { CognitiveLab } from './components/CognitiveLab';
import { FreeTalkMode } from './components/FreeTalkMode';
import { VocabularyPack } from './components/VocabularyPack';
import { VoiceHistoryPage } from './components/VoiceHistoryPage';
import { StatsDashboard } from './components/StatsDashboard';
import { VoiceSettingsModal } from './components/VoiceSettingsModal';
import { backendAPI } from './services/api';

// Helper to compute stats dynamically from actual recorded sessions
export function computeStatsFromHistory(history: SpeechFeedback[], savedWordIds: string[] = []): UserStats {
  if (!history || history.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      totalMinutesSpoken: 0,
      totalSessionsCompleted: 0,
      avgGrammarScore: 0,
      avgStarScore: 0,
      lastPracticedDate: '',
      savedWordIds,
      history: []
    };
  }

  const totalSessionsCompleted = history.length;
  let totalWords = 0;
  let totalFluencyScore = 0;
  const starScores: number[] = [];

  history.forEach(s => {
    const words = (s.originalTranscript || '').split(/\s+/).filter(Boolean).length;
    totalWords += Math.max(15, words);
    totalFluencyScore += s.fluencyScore;
    if (s.starAnalysis && typeof s.starAnalysis.overallScore === 'number') {
      starScores.push(s.starAnalysis.overallScore);
    }
  });

  const totalMinutesSpoken = Math.max(totalSessionsCompleted, Math.round(totalWords / 120));
  const avgGrammarScore = Math.round(totalFluencyScore / totalSessionsCompleted);
  const avgStarScore = starScores.length > 0 ? Math.round(starScores.reduce((a, b) => a + b, 0) / starScores.length) : 0;

  // Real-time streak calculation from calendar dates
  const uniqueDates = Array.from(new Set(history.map(s => (s.timestamp || new Date().toISOString()).split('T')[0]))).sort().reverse();
  let currentStreak = 0;

  if (uniqueDates.length > 0) {
    let checkDate = new Date();
    let dStr = checkDate.toISOString().split('T')[0];

    if (!uniqueDates.includes(dStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
      dStr = checkDate.toISOString().split('T')[0];
    }

    while (uniqueDates.includes(dStr)) {
      currentStreak++;
      checkDate.setDate(checkDate.getDate() - 1);
      dStr = checkDate.toISOString().split('T')[0];
    }
  }

  return {
    currentStreak,
    bestStreak: currentStreak,
    totalMinutesSpoken,
    totalSessionsCompleted,
    avgGrammarScore,
    avgStarScore,
    lastPracticedDate: uniqueDates[0] || '',
    savedWordIds,
    history
  };
}

export function App() {
  const [activeTab, setActiveTab] = useState<PracticeMode | 'words' | 'stats' | 'history'>('story');
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);

  // Load persistent Voice Settings from localStorage
  const [voiceSettings, setVoiceSettings] = useState<VoiceSettings>(() => {
    const saved = localStorage.getItem('talk_coach_settings');
    if (saved) {
      try { return JSON.parse(saved); } catch (e) {}
    }
    return {
      accent: 'en-US',
      rate: 0.95,
      pitch: 1.0,
      autoPlayTTS: true,
      apiKey: '',
      apiProvider: 'mock'
    };
  });

  // Load persistent User Stats & History (starting at 0 for real performance tracking)
  const [userStats, setUserStats] = useState<UserStats>(() => {
    const saved = localStorage.getItem('talk_coach_stats');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return computeStatsFromHistory(parsed.history || [], parsed.savedWordIds || []);
      } catch (e) {}
    }
    return computeStatsFromHistory([]);
  });

  // Initial backend sync on load
  useEffect(() => {
    backendAPI.getSessions().then(remoteSessions => {
      if (remoteSessions) {
        setUserStats(prev => computeStatsFromHistory(remoteSessions, prev.savedWordIds));
      }
    });
  }, []);

  // Save Settings to localStorage
  useEffect(() => {
    localStorage.setItem('talk_coach_settings', JSON.stringify(voiceSettings));
  }, [voiceSettings]);

  // Save Stats to localStorage
  useEffect(() => {
    localStorage.setItem('talk_coach_stats', JSON.stringify(userStats));
  }, [userStats]);

  // Handler when speech session completes
  const handleSessionComplete = async (newFeedback: SpeechFeedback) => {
    await backendAPI.saveSession(newFeedback);

    setUserStats(prev => {
      const newHistory = [newFeedback, ...prev.history];
      return computeStatsFromHistory(newHistory, prev.savedWordIds);
    });
  };

  // Handler to toggle saving a word
  const handleToggleSaveWord = (wordId: string) => {
    setUserStats(prev => {
      const isSaved = prev.savedWordIds.includes(wordId);
      const newSaved = isSaved
        ? prev.savedWordIds.filter(id => id !== wordId)
        : [...prev.savedWordIds, wordId];

      return {
        ...prev,
        savedWordIds: newSaved
      };
    });
  };

  // Handler to delete a single session
  const handleDeleteSession = async (id: string) => {
    await backendAPI.deleteSession(id);
    setUserStats(prev => {
      const newHistory = prev.history.filter(item => item.id !== id);
      return computeStatsFromHistory(newHistory, prev.savedWordIds);
    });
  };

  // Handler to clear history
  const handleClearHistory = async () => {
    await backendAPI.clearHistory();
    setUserStats(prev => computeStatsFromHistory([], prev.savedWordIds));
  };

  return (
    <div className="min-h-screen text-slate-900 font-sans selection:bg-slate-900 selection:text-white pb-12 flex flex-col justify-between relative overflow-hidden bg-neurova-tint">
      <div>
        {/* Navigation Floating Glass Pill Bar */}
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          onOpenSettings={() => setIsSettingsOpen(true)}
          streakCount={userStats.currentStreak}
        />

        {/* Main Content Area in Large Light Frosted Glass Container (Neurova Theme) */}
        <main className="w-full max-w-[1500px] mx-auto px-2 sm:px-4 lg:px-6">
          <div className="glass-container rounded-[32px] p-6 sm:p-8 lg:p-10 shadow-2xl border border-white/90 text-slate-900">
            {activeTab === 'story' && (
              <StoryMode
                settings={voiceSettings}
                onSessionComplete={handleSessionComplete}
              />
            )}

            {activeTab === 'interview' && (
              <InterviewMode
                settings={voiceSettings}
                onSessionComplete={handleSessionComplete}
              />
            )}

            {activeTab === 'cognitive' && (
              <CognitiveLab
                settings={voiceSettings}
                onSessionComplete={handleSessionComplete}
              />
            )}

            {activeTab === 'free' && (
              <FreeTalkMode
                settings={voiceSettings}
                onSessionComplete={handleSessionComplete}
              />
            )}

            {activeTab === 'words' && (
              <VocabularyPack
                settings={voiceSettings}
                savedWordIds={userStats.savedWordIds}
                onToggleSaveWord={handleToggleSaveWord}
              />
            )}

            {activeTab === 'history' && (
              <VoiceHistoryPage
                history={userStats.history}
                settings={voiceSettings}
                onDeleteSession={handleDeleteSession}
                onClearAll={handleClearHistory}
              />
            )}

            {activeTab === 'stats' && (
              <StatsDashboard
                stats={userStats}
                settings={voiceSettings}
                onClearHistory={handleClearHistory}
                onToggleSaveWord={handleToggleSaveWord}
              />
            )}
          </div>
        </main>
      </div>

      {/* Voice Settings Modal */}
      <VoiceSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        settings={voiceSettings}
        onSaveSettings={setVoiceSettings}
      />

      {/* App Footer */}
      <footer className="mt-12 text-center text-xs text-slate-700 font-semibold px-4">
        <span>Talk-a-Tron — Voice AI Speaking, STAR Interview & Cognitive Reasoning Simulator</span>
        <span className="mx-2">•</span>
        <span>Neurova Light Organic Glass Theme</span>
        <span className="mx-2">•</span>
        <span>Real-Time Performance Engine</span>
      </footer>
    </div>
  );
}
