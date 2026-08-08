import React, { useState } from 'react';
import { BarChart3, Flame, Clock, Award, Target, BookMarked, History, Volume2, ArrowUpRight, Trash2 } from 'lucide-react';
import type { UserStats, SpeechFeedback, VoiceSettings } from '../types';
import { DAILY_VOCABULARY } from '../data/mockData';
import { speechEngine } from '../services/speech';

interface StatsDashboardProps {
  stats: UserStats;
  settings: VoiceSettings;
  onClearHistory: () => void;
  onToggleSaveWord: (wordId: string) => void;
}

export const StatsDashboard: React.FC<StatsDashboardProps> = ({
  stats,
  settings,
  onClearHistory
}) => {
  const [selectedHistoryItem, setSelectedHistoryItem] = useState<SpeechFeedback | null>(null);

  const savedWordObjects = DAILY_VOCABULARY.filter(w => stats.savedWordIds.includes(w.id));

  return (
    <div className="space-y-8 animate-fadeIn w-full mx-auto">
      {/* Header */}
      <div className="glass-card p-6 rounded-3xl border border-white/80 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-sm shrink-0">
            <BarChart3 className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Your Progress & Analytics</h2>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">Track your daily streaks, fluency score improvements, and past session history.</p>
          </div>
        </div>

        {stats.history.length > 0 && (
          <button
            onClick={onClearHistory}
            className="px-4 py-2 rounded-full border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 text-xs font-extrabold flex items-center space-x-1.5 self-start sm:self-auto transition shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Clear History</span>
          </button>
        )}
      </div>

      {/* Main Metric Cards Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* Streak */}
        <div className="glass-card p-5 rounded-2xl border border-amber-200 bg-white/90 space-y-2 relative overflow-hidden shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Daily Streak</span>
            <Flame className="w-5 h-5 text-amber-500 fill-amber-500 animate-bounce" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-sans">{stats.currentStreak} Days</div>
          <div className="text-[11px] text-amber-800 font-bold">Best Record: {stats.bestStreak} Days</div>
        </div>

        {/* Fluency Score */}
        <div className="glass-card p-5 rounded-2xl border border-emerald-200 bg-white/90 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Avg Fluency</span>
            <Award className="w-5 h-5 text-emerald-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-sans">{stats.avgGrammarScore}%</div>
          <div className="text-[11px] text-emerald-800 font-bold">Grammar & Flow Rating</div>
        </div>

        {/* Speaking Minutes */}
        <div className="glass-card p-5 rounded-2xl border border-slate-300 bg-white/90 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">Talking Time</span>
            <Clock className="w-5 h-5 text-slate-900" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-sans">{stats.totalMinutesSpoken} Mins</div>
          <div className="text-[11px] text-slate-700 font-bold">{stats.totalSessionsCompleted} Sessions Completed</div>
        </div>

        {/* STAR Rating */}
        <div className="glass-card p-5 rounded-2xl border border-purple-200 bg-white/90 space-y-2 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">STAR Interview</span>
            <Target className="w-5 h-5 text-purple-600" />
          </div>
          <div className="text-3xl font-extrabold text-slate-900 font-sans">{stats.avgStarScore}%</div>
          <div className="text-[11px] text-purple-800 font-bold">Interview Readiness</div>
        </div>
      </div>

      {/* Saved Words Gallery */}
      <div className="glass-card p-6 rounded-3xl border border-white/90 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <BookMarked className="w-5 h-5 text-emerald-600" />
            <h3 className="text-base font-extrabold text-slate-900">Bookmarked Words ({savedWordObjects.length})</h3>
          </div>
        </div>

        {savedWordObjects.length === 0 ? (
          <div className="text-xs text-slate-600 font-semibold italic py-4 text-center">
            No bookmarked words yet. Tap the bookmark icon on any 10-Word item to save it here!
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {savedWordObjects.map(w => (
              <div key={w.id} className="p-3.5 rounded-xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                <div className="flex items-center justify-between">
                  <span className="font-extrabold text-sm text-slate-900">{w.word}</span>
                  <button
                    onClick={() => speechEngine.speak(w.word, { accent: settings.accent })}
                    className="p-1 rounded bg-slate-100 text-slate-700 hover:text-slate-900"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-[11px] text-slate-600 font-medium leading-snug line-clamp-2">{w.definition}</div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Practice Session History List */}
      <div className="glass-card p-6 rounded-3xl border border-white/90 space-y-4 shadow-md">
        <div className="flex items-center justify-between border-b border-slate-200 pb-3">
          <div className="flex items-center space-x-2">
            <History className="w-5 h-5 text-slate-900" />
            <h3 className="text-base font-extrabold text-slate-900">Practice History ({stats.history.length})</h3>
          </div>
        </div>

        {stats.history.length === 0 ? (
          <div className="text-xs text-slate-600 font-semibold italic py-8 text-center">
            No practice sessions recorded yet. Start practicing in Story, STAR Interview, or Free-Talk mode!
          </div>
        ) : (
          <div className="space-y-3">
            {stats.history.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedHistoryItem(item)}
                className="p-4 rounded-2xl bg-white border border-slate-200 hover:border-slate-400 cursor-pointer transition flex items-center justify-between gap-4 shadow-2xs"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-200 text-slate-800">
                      {item.mode} Mode
                    </span>
                    {item.promptTitle && (
                      <span className="text-xs font-extrabold text-slate-900 line-clamp-1">{item.promptTitle}</span>
                    )}
                  </div>
                  <p className="text-xs text-slate-600 font-medium line-clamp-1">"{item.originalTranscript}"</p>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="text-right">
                    <div className="text-sm font-extrabold text-emerald-700">{item.fluencyScore}% Score</div>
                    <div className="text-[10px] text-slate-500 font-semibold">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                  <ArrowUpRight className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* History Detail Modal */}
      {selectedHistoryItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md">
          <div className="glass-card w-full max-w-2xl rounded-3xl border border-white/90 p-6 space-y-4 max-h-[85vh] overflow-y-auto bg-white/95 text-slate-900 shadow-2xl">
            <div className="flex justify-between items-center border-b border-slate-200 pb-3">
              <h3 className="text-lg font-extrabold text-slate-900">Session Detail Review</h3>
              <button
                onClick={() => setSelectedHistoryItem(null)}
                className="text-xs text-slate-700 font-bold hover:text-slate-900 px-3 py-1 bg-slate-200 rounded-full"
              >
                Close
              </button>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-extrabold text-slate-800 uppercase tracking-wider">Original Transcript</div>
              <p className="text-xs text-slate-800 font-medium p-3.5 rounded-2xl bg-slate-50 border border-slate-200 leading-relaxed">
                "{selectedHistoryItem.originalTranscript}"
              </p>
            </div>

            <div className="space-y-2">
              <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider">AI Corrected Speech</div>
              <p className="text-xs text-slate-900 font-semibold p-3.5 rounded-2xl bg-slate-900 text-white leading-relaxed">
                "{selectedHistoryItem.correctedText}"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
