import React, { useState, useEffect } from 'react';
import { BookMarked, Volume2, Bookmark, RotateCw, Sparkles, Layers, List, HelpCircle, Calendar, RefreshCw } from 'lucide-react';
import type { WordOfDay, VoiceSettings } from '../types';
import { getDailyWords } from '../data/wordBank';
import { speechEngine } from '../services/speech';

interface VocabularyPackProps {
  settings: VoiceSettings;
  savedWordIds: string[];
  onToggleSaveWord: (wordId: string) => void;
}

export const VocabularyPack: React.FC<VocabularyPackProps> = ({
  settings,
  savedWordIds,
  onToggleSaveWord
}) => {
  const [todayDateStr, setTodayDateStr] = useState<string>(() => new Date().toISOString().split('T')[0]);
  const [dailyWords, setDailyWords] = useState<WordOfDay[]>(() => getDailyWords());
  const [viewMode, setViewMode] = useState<'list' | 'flashcards' | 'quiz'>('list');
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [playingWordId, setPlayingWordId] = useState<string | null>(null);

  // Quiz state
  const [quizScore, setQuizScore] = useState(0);
  const [quizIndex, setQuizIndex] = useState(0);
  const [selectedAnswerIndex, setSelectedAnswerIndex] = useState<number | null>(null);
  const [quizCompleted, setQuizCompleted] = useState(false);

  // Recalculate daily words whenever date changes
  useEffect(() => {
    setDailyWords(getDailyWords(todayDateStr));
  }, [todayDateStr]);

  const handlePronounce = (wordObj: WordOfDay) => {
    setPlayingWordId(wordObj.id);
    if (wordObj.audioUrl) {
      const audio = new Audio(wordObj.audioUrl);
      audio.play().then(() => {
        setTimeout(() => setPlayingWordId(null), 1200);
      }).catch(() => {
        speechEngine.speak(wordObj.word, { accent: settings.accent, rate: 0.9, onEnd: () => setPlayingWordId(null) });
      });
    } else {
      speechEngine.speak(wordObj.word, { accent: settings.accent, rate: 0.9, onEnd: () => setPlayingWordId(null) });
    }
  };

  const handleNextFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev + 1) % dailyWords.length);
  };

  const handlePrevFlashcard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev - 1 + dailyWords.length) % dailyWords.length);
  };

  // Quiz Logic
  const currentQuizWord = dailyWords[quizIndex] || dailyWords[0];
  const quizOptions = React.useMemo(() => {
    if (!currentQuizWord) return [];
    const wrong = dailyWords.filter(w => w.id !== currentQuizWord.id).map(w => w.definition);
    const shuffledWrong = [...wrong].sort(() => 0.5 - Math.random()).slice(0, 3);
    const options = [...shuffledWrong, currentQuizWord.definition].sort(() => 0.5 - Math.random());
    return options;
  }, [quizIndex, dailyWords, currentQuizWord]);

  const handleSelectQuizAnswer = (optionIndex: number) => {
    if (selectedAnswerIndex !== null) return;
    setSelectedAnswerIndex(optionIndex);

    if (quizOptions[optionIndex] === currentQuizWord.definition) {
      setQuizScore(prev => prev + 1);
    }

    setTimeout(() => {
      if (quizIndex < dailyWords.length - 1) {
        setQuizIndex(prev => prev + 1);
        setSelectedAnswerIndex(null);
      } else {
        setQuizCompleted(true);
      }
    }, 1200);
  };

  const resetQuiz = () => {
    setQuizIndex(0);
    setQuizScore(0);
    setSelectedAnswerIndex(null);
    setQuizCompleted(false);
  };

  const handleSimulateNextDay = () => {
    const curr = new Date(todayDateStr);
    curr.setDate(curr.getDate() + 1);
    const nextStr = curr.toISOString().split('T')[0];
    setTodayDateStr(nextStr);
    resetQuiz();
    setFlashcardIndex(0);
  };

  return (
    <div className="space-y-8 animate-fadeIn w-full mx-auto">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 glass-card p-6 rounded-3xl border border-white/80">
        <div className="flex items-center space-x-3.5">
          <div className="p-3 bg-slate-900 text-white rounded-2xl shadow-sm shrink-0">
            <BookMarked className="w-6 h-6 text-emerald-400" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h2 className="text-xl font-extrabold text-slate-900 tracking-tight">Daily 10 Words Pack</h2>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase bg-slate-200 text-slate-800 flex items-center gap-1">
                <Calendar className="w-3 h-3 text-slate-700" />
                {todayDateStr}
              </span>
            </div>
            <p className="text-xs text-slate-600 font-semibold mt-0.5">Rotates automatically every single calendar day! Master 10 high-impact English words daily.</p>
          </div>
        </div>

        {/* Action Controls & Mode Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
          <button
            onClick={handleSimulateNextDay}
            className="px-3.5 py-1.5 rounded-full border border-slate-300 bg-white/90 text-[11px] font-extrabold text-slate-800 hover:bg-white flex items-center space-x-1.5 shadow-xs transition"
            title="Preview Tomorrow's 10 Words"
          >
            <RefreshCw className="w-3.5 h-3.5 text-emerald-600" />
            <span>Simulate Tomorrow's Words</span>
          </button>

          <div className="flex items-center p-1 rounded-full bg-slate-100 border border-slate-300">
            <button
              onClick={() => setViewMode('list')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center space-x-1.5 transition ${
                viewMode === 'list' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>List</span>
            </button>
            <button
              onClick={() => setViewMode('flashcards')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center space-x-1.5 transition ${
                viewMode === 'flashcards' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Flashcards</span>
            </button>
            <button
              onClick={() => setViewMode('quiz')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-extrabold flex items-center space-x-1.5 transition ${
                viewMode === 'quiz' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Vocab Quiz</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mode 1: Detailed List View */}
      {viewMode === 'list' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {dailyWords.map((item, idx) => {
            const isSaved = savedWordIds.includes(item.id);
            return (
              <div
                key={item.id}
                className="glass-card p-5 rounded-2xl border border-white/90 space-y-3 shadow-md relative group hover:border-slate-400 transition"
              >
                {/* Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="w-6 h-6 rounded-lg bg-slate-900 text-white text-xs font-extrabold flex items-center justify-center">
                      {idx + 1}
                    </span>
                    <h3 className="text-lg font-extrabold text-slate-900 tracking-tight">{item.word}</h3>
                    <span className="text-xs text-slate-600 font-serif italic font-medium">{item.phonetic}</span>
                  </div>

                  <div className="flex items-center space-x-1.5">
                    <button
                      onClick={() => handlePronounce(item)}
                      className={`p-2 rounded-xl border transition ${
                        playingWordId === item.id
                          ? 'border-emerald-600 bg-emerald-100 text-emerald-900 font-bold animate-pulse'
                          : 'border-slate-300 bg-white/90 text-slate-700 hover:text-slate-900 hover:bg-white'
                      }`}
                      title="Listen Pronunciation"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => onToggleSaveWord(item.id)}
                      className={`p-2 rounded-xl border transition ${
                        isSaved
                          ? 'border-amber-400 bg-amber-100 text-amber-900 font-bold'
                          : 'border-slate-300 bg-white/90 text-slate-700 hover:text-slate-900 hover:bg-white'
                      }`}
                      title="Bookmark Word"
                    >
                      <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-amber-500 text-amber-500' : ''}`} />
                    </button>
                  </div>
                </div>

                {/* Details */}
                <div className="space-y-2 text-xs">
                  <div className="flex items-center space-x-2">
                    <span className="px-2 py-0.5 rounded-full font-extrabold uppercase text-[10px] bg-slate-200 text-slate-800">
                      {item.partOfSpeech}
                    </span>
                    <span className="px-2 py-0.5 rounded-full font-extrabold uppercase text-[10px] bg-amber-100 text-amber-900 border border-amber-300">
                      {item.difficulty}
                    </span>
                  </div>

                  <p className="text-slate-900 text-sm leading-relaxed font-semibold">
                    <strong className="text-slate-900 font-extrabold">Meaning:</strong> {item.definition}
                  </p>

                  <div className="p-3 rounded-xl bg-white border border-slate-200 text-slate-800 italic text-xs leading-relaxed font-medium shadow-2xs">
                    "{item.example}"
                  </div>

                  <div className="text-slate-700 text-xs font-semibold">
                    <strong className="text-slate-900 font-extrabold">Synonyms:</strong> {item.synonym}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Mode 2: 3D Flip Flashcards */}
      {viewMode === 'flashcards' && dailyWords.length > 0 && (
        <div className="flex flex-col items-center space-y-6">
          <div className="text-xs text-slate-800 font-extrabold uppercase tracking-wider">
            Flashcard {flashcardIndex + 1} of {dailyWords.length} — Click Card to Flip 🔄
          </div>

          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="w-full max-w-lg h-72 cursor-pointer perspective-1000"
          >
            <div
              className={`relative w-full h-full duration-500 transform-style-3d transition-transform ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Card Front */}
              <div className="absolute inset-0 w-full h-full glass-card rounded-3xl border border-white/90 p-8 flex flex-col items-center justify-center text-center space-y-4 backface-hidden shadow-2xl bg-white/95">
                <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase bg-slate-200 text-slate-800">
                  {dailyWords[flashcardIndex].difficulty}
                </span>
                <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  {dailyWords[flashcardIndex].word}
                </h2>
                <p className="text-sm font-serif italic text-slate-700 font-medium">
                  {dailyWords[flashcardIndex].phonetic} ({dailyWords[flashcardIndex].partOfSpeech})
                </p>
                <div className="text-xs text-emerald-700 font-extrabold pt-2 flex items-center gap-1">
                  <span>Tap to reveal definition</span>
                  <RotateCw className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card Back */}
              <div className="absolute inset-0 w-full h-full glass-card rounded-3xl border border-slate-900/20 p-8 flex flex-col items-center justify-center text-center space-y-3 backface-hidden rotate-y-180 shadow-2xl bg-slate-900 text-white">
                <h3 className="text-lg font-extrabold text-emerald-400">
                  {dailyWords[flashcardIndex].word}
                </h3>
                <p className="text-sm text-slate-100 font-semibold leading-relaxed">
                  {dailyWords[flashcardIndex].definition}
                </p>
                <p className="text-xs text-slate-300 italic p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                  "{dailyWords[flashcardIndex].example}"
                </p>
              </div>
            </div>
          </div>

          {/* Flashcard Controls */}
          <div className="flex items-center space-x-4">
            <button
              onClick={handlePrevFlashcard}
              className="px-5 py-2.5 rounded-full border border-slate-300 bg-white text-xs font-extrabold text-slate-800 hover:bg-slate-100 shadow-xs"
            >
              Previous
            </button>
            <button
              onClick={() => handlePronounce(dailyWords[flashcardIndex])}
              className="btn-dark p-3.5 rounded-full shadow-md hover:scale-105 transition"
            >
              <Volume2 className="w-5 h-5 text-emerald-400" />
            </button>
            <button
              onClick={handleNextFlashcard}
              className="px-5 py-2.5 rounded-full border border-slate-300 bg-white text-xs font-extrabold text-slate-800 hover:bg-slate-100 shadow-xs"
            >
              Next Word
            </button>
          </div>
        </div>
      )}

      {/* Mode 3: Interactive Vocab Quiz */}
      {viewMode === 'quiz' && currentQuizWord && (
        <div className="glass-card p-6 md:p-8 rounded-3xl border border-white/90 max-w-xl mx-auto space-y-6 shadow-xl">
          {!quizCompleted ? (
            <>
              <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                <span className="text-xs font-extrabold uppercase text-slate-800 tracking-wider">
                  Question {quizIndex + 1} of {dailyWords.length}
                </span>
                <span className="text-xs font-extrabold text-emerald-700">Score: {quizScore}</span>
              </div>

              <div className="space-y-2">
                <div className="text-xs text-slate-600 font-bold">Select the correct definition for:</div>
                <h3 className="text-2xl font-extrabold text-slate-900 tracking-tight">{currentQuizWord.word}</h3>
              </div>

              <div className="space-y-3">
                {quizOptions.map((opt, i) => {
                  let btnStyle = 'border-slate-200 bg-slate-50 text-slate-900 font-medium hover:bg-white hover:border-slate-400';

                  if (selectedAnswerIndex !== null) {
                    if (opt === currentQuizWord.definition) {
                      btnStyle = 'border-emerald-500 bg-emerald-100 text-emerald-900 font-extrabold';
                    } else if (i === selectedAnswerIndex) {
                      btnStyle = 'border-rose-400 bg-rose-100 text-rose-900 font-bold';
                    }
                  }

                  return (
                    <button
                      key={i}
                      disabled={selectedAnswerIndex !== null}
                      onClick={() => handleSelectQuizAnswer(i)}
                      className={`w-full p-4 rounded-2xl border text-left text-xs leading-relaxed transition-all ${btnStyle}`}
                    >
                      {opt}
                    </button>
                  );
                })}
              </div>
            </>
          ) : (
            <div className="text-center py-6 space-y-4">
              <Sparkles className="w-12 h-12 text-amber-500 mx-auto animate-bounce" />
              <h3 className="text-2xl font-extrabold text-slate-900">Quiz Completed!</h3>
              <p className="text-sm text-slate-800 font-semibold">
                You scored <strong className="text-slate-900 font-extrabold">{quizScore}</strong> out of {dailyWords.length}!
              </p>
              <button
                onClick={resetQuiz}
                className="btn-dark px-6 py-2.5 rounded-full font-extrabold text-xs shadow-md"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
