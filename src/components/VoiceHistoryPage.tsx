import React, { useState, useRef } from 'react';
import { History, Search, Trash2, Volume2, Sparkles, AlertTriangle, ArrowRight, ShieldCheck, Target, Calendar, ChevronDown, ChevronUp, Mic } from 'lucide-react';
import type { SpeechFeedback, VoiceSettings } from '../types';
import { speechEngine } from '../services/speech';

interface VoiceHistoryPageProps {
  history: SpeechFeedback[];
  settings: VoiceSettings;
  onDeleteSession: (id: string) => void;
  onClearAll: () => void;
}

export const VoiceHistoryPage: React.FC<VoiceHistoryPageProps> = ({
  history,
  settings,
  onDeleteSession,
  onClearAll
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modeFilter, setModeFilter] = useState<string>('All');
  const [expandedSessionId, setExpandedSessionId] = useState<string | null>(null);
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playingUserAudioId, setPlayingUserAudioId] = useState<string | null>(null);
  const userAudioPlayerRef = useRef<HTMLAudioElement | null>(null);

  const filteredHistory = history.filter(item => {
    const matchesMode = modeFilter === 'All' || item.mode === modeFilter;
    const matchesSearch = !searchQuery ||
      item.originalTranscript.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.correctedText.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.promptTitle && item.promptTitle.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesMode && matchesSearch;
  });

  const handlePlayTTS = (id: string, text: string) => {
    setPlayingId(id);
    speechEngine.speak(text, {
      accent: settings.accent,
      rate: settings.rate,
      pitch: settings.pitch,
      onEnd: () => setPlayingId(null)
    });
  };

  const handlePlayUserAudio = (id: string, audioUrl: string) => {
    if (playingUserAudioId === id && userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
      setPlayingUserAudioId(null);
      return;
    }

    if (userAudioPlayerRef.current) {
      userAudioPlayerRef.current.pause();
    }

    userAudioPlayerRef.current = new Audio(audioUrl);
    userAudioPlayerRef.current.onended = () => setPlayingUserAudioId(null);
    userAudioPlayerRef.current.play().then(() => {
      setPlayingUserAudioId(id);
    }).catch(err => console.error(err));
  };

  const getScoreBadge = (score: number) => {
    if (score >= 85) return 'text-emerald-800 border-emerald-300 bg-emerald-100';
    if (score >= 70) return 'text-amber-900 border-amber-300 bg-amber-100';
    return 'text-rose-900 border-rose-300 bg-rose-100';
  };

  return (
    <div className="space-y-8 animate-fadeIn w-full mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-white/80">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-sm shrink-0">
            <History className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Voice Practice History & Log</h2>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">Review all your past spoken interactions, recorded audio clips, and STAR evaluations stored persistently.</p>
          </div>
        </div>

        {history.length > 0 && (
          <button
            onClick={onClearAll}
            className="px-4 py-2 rounded-full border border-rose-200 bg-rose-50 text-rose-800 hover:bg-rose-100 text-xs font-extrabold flex items-center space-x-1.5 self-start sm:self-auto transition shadow-xs"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-600" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {/* Search & Mode Filters */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between items-center">
        {/* Mode Pills */}
        <div className="flex items-center space-x-2 overflow-x-auto w-full sm:w-auto pb-1 no-scrollbar">
          {['All', 'story', 'interview', 'free'].map(m => (
            <button
              key={m}
              onClick={() => setModeFilter(m)}
              className={`px-4 py-1.5 rounded-full text-xs font-extrabold whitespace-nowrap transition ${
                modeFilter === m
                  ? 'glass-pill-active shadow-md'
                  : 'bg-white/80 text-slate-700 hover:text-slate-900 hover:bg-white border border-slate-300'
              }`}
            >
              {m === 'All' ? 'All Modes' : `${m.charAt(0).toUpperCase() + m.slice(1)} Mode`}
            </button>
          ))}
        </div>

        {/* Search Bar */}
        <div className="relative w-full sm:w-72">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search transcripts or topics..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-300 rounded-full text-slate-900 placeholder-slate-500 text-xs font-semibold focus:outline-none focus:border-slate-900 shadow-xs"
          />
        </div>
      </div>

      {/* History List Cards */}
      {filteredHistory.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl border border-white/90 text-center space-y-3 shadow-md">
          <Mic className="w-12 h-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-extrabold text-slate-900">No Voice Sessions Recorded</h3>
          <p className="text-xs text-slate-600 font-semibold max-w-sm mx-auto">
            {searchQuery
              ? `No sessions found matching "${searchQuery}".`
              : 'Speak into the mic in Story, STAR Interview, or Free-Talk mode to log your first voice session!'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredHistory.map(item => {
            const isExpanded = expandedSessionId === item.id;
            return (
              <div
                key={item.id}
                className="glass-card rounded-3xl border border-white/90 p-5 md:p-6 space-y-4 hover:border-slate-400 transition shadow-md"
              >
                {/* Session Card Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
                  <div className="flex items-center space-x-3.5">
                    <div className={`p-3 rounded-2xl border text-center ${getScoreBadge(item.fluencyScore)} shadow-2xs shrink-0`}>
                      <div className="text-xl font-extrabold font-sans leading-none">{item.fluencyScore}%</div>
                      <div className="text-[9px] font-extrabold uppercase tracking-wider mt-0.5 opacity-90">Fluency</div>
                    </div>

                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-200 text-slate-800">
                          {item.mode} Mode
                        </span>
                        <span className="text-xs text-slate-600 font-bold flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-slate-500" />
                          {new Date(item.timestamp).toLocaleString()}
                        </span>
                      </div>
                      {item.promptTitle && (
                        <h4 className="text-sm font-extrabold text-slate-900 mt-1 line-clamp-1">{item.promptTitle}</h4>
                      )}
                    </div>
                  </div>

                  {/* Top Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2 self-start sm:self-auto">
                    {item.userAudioUrl && (
                      <button
                        onClick={() => handlePlayUserAudio(item.id, item.userAudioUrl!)}
                        className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center space-x-1.5 border transition shadow-2xs ${
                          playingUserAudioId === item.id
                            ? 'border-emerald-600 bg-emerald-100 text-emerald-900 animate-pulse'
                            : 'border-slate-300 bg-white text-emerald-700 hover:bg-slate-100'
                        }`}
                      >
                        <Mic className="w-3.5 h-3.5 text-emerald-700" />
                        <span>{playingUserAudioId === item.id ? 'Playing Mic...' : 'Play Recording'}</span>
                      </button>
                    )}

                    <button
                      onClick={() => handlePlayTTS(item.id, item.correctedText)}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center space-x-1.5 border transition shadow-2xs ${
                        playingId === item.id
                          ? 'border-slate-900 bg-slate-900 text-white animate-pulse'
                          : 'border-slate-300 bg-white text-slate-800 hover:bg-slate-100'
                      }`}
                    >
                      <Volume2 className="w-3.5 h-3.5 text-slate-800" />
                      <span>{playingId === item.id ? 'Reading AI...' : 'Play AI Voice'}</span>
                    </button>

                    <button
                      onClick={() => setExpandedSessionId(isExpanded ? null : item.id)}
                      className="p-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition shadow-2xs"
                      title={isExpanded ? 'Collapse Details' : 'Expand Details'}
                    >
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => onDeleteSession(item.id)}
                      className="p-2 rounded-full border border-slate-300 bg-white text-slate-700 hover:text-rose-600 hover:bg-slate-100 transition shadow-2xs"
                      title="Delete Entry"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Transcripts Comparison */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-white border border-slate-200 space-y-1 shadow-2xs">
                    <div className="font-extrabold text-slate-700 uppercase tracking-wider text-[10px]">
                      Original Spoken Speech
                    </div>
                    <p className="text-slate-800 italic font-medium leading-relaxed">
                      "{item.originalTranscript}"
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-900 text-white space-y-1 shadow-2xs">
                    <div className="font-extrabold text-emerald-400 uppercase tracking-wider text-[10px] flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> AI Corrected Text
                    </div>
                    <p className="text-slate-100 font-semibold leading-relaxed">
                      "{item.correctedText}"
                    </p>
                  </div>
                </div>

                {/* Expandable Breakdown Panel */}
                {isExpanded && (
                  <div className="space-y-4 pt-3 border-t border-slate-200 animate-fadeIn">
                    {/* Grammar Fixes */}
                    <div className="space-y-2">
                      <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                        <span>Grammar Corrections ({item.grammarErrors.length})</span>
                      </div>
                      <div className="space-y-2">
                        {item.grammarErrors.map((err, i) => (
                          <div key={i} className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1 font-semibold">
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-extrabold">
                                {err.type}
                              </span>
                              <span className="line-through text-rose-600">{err.original}</span>
                              <ArrowRight className="w-3 h-3 text-slate-500" />
                              <span className="font-extrabold text-emerald-700">{err.replacement}</span>
                            </div>
                            <p className="text-slate-600 text-[11px]">💡 {err.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Vocabulary Upgrades */}
                    <div className="space-y-2">
                      <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Executive Phrasing Upgrades ({item.vocabularyUpgrades.length})</span>
                      </div>
                      <div className="space-y-2">
                        {item.vocabularyUpgrades.map((upg, i) => (
                          <div key={i} className="p-3 rounded-xl bg-white border border-slate-200 text-xs space-y-1 font-semibold">
                            <div className="flex items-center space-x-2">
                              <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-900 text-[10px] font-extrabold">
                                {upg.registerLevel}
                              </span>
                              <span className="text-slate-600">"{upg.original}"</span>
                              <ArrowRight className="w-3 h-3 text-slate-500" />
                              <span className="font-extrabold text-slate-900">"{upg.upgraded}"</span>
                            </div>
                            <p className="text-slate-700 text-[11px]">✨ {upg.explanation}</p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* STAR Rubric if available */}
                    {item.starAnalysis && (
                      <div className="space-y-2">
                        <div className="text-xs font-extrabold text-slate-900 uppercase tracking-wider flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5 text-emerald-600" />
                          <span>STAR Interview Rubric Breakdown ({item.starAnalysis.overallScore}%)</span>
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs">
                          <div className="p-3 rounded-xl bg-white border border-slate-200 font-extrabold">
                            <div className="text-[10px] text-slate-600">Situation</div>
                            <div className="text-base text-slate-900">{item.starAnalysis.situationScore}%</div>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-slate-200 font-extrabold">
                            <div className="text-[10px] text-slate-600">Task</div>
                            <div className="text-base text-slate-900">{item.starAnalysis.taskScore}%</div>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-slate-200 font-extrabold">
                            <div className="text-[10px] text-slate-600">Action</div>
                            <div className="text-base text-emerald-700">{item.starAnalysis.actionScore}%</div>
                          </div>
                          <div className="p-3 rounded-xl bg-white border border-slate-200 font-extrabold">
                            <div className="text-[10px] text-slate-600">Result</div>
                            <div className="text-base text-amber-700">{item.starAnalysis.resultScore}%</div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
