import React, { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, RotateCcw, Sparkles, AlertCircle, MessageSquareText, Radio, Globe, Edit3, Cpu, Play, Pause, Volume2 } from 'lucide-react';
import { AudioVisualizer } from './AudioVisualizer';
import { speechEngine } from '../services/speech';

interface VoiceRecorderHeroProps {
  onAnalyze: (transcript: string, userAudioUrl?: string) => void;
  isAnalyzing: boolean;
  activePromptText?: string;
  speakingTask?: string;
  modeLabel: string;
  defaultAccent?: string;
  apiKey?: string;
}

export const VoiceRecorderHero: React.FC<VoiceRecorderHeroProps> = ({
  onAnalyze,
  isAnalyzing,
  speakingTask,
  modeLabel,
  defaultAccent = 'en-US',
  apiKey = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [selectedAccent, setSelectedAccent] = useState<string>(defaultAccent);
  const [engineMode, setEngineMode] = useState<'webspeech' | 'whisper'>('webspeech');
  const [isRefiningWithAI, setIsRefiningWithAI] = useState(false);
  
  // User recorded audio player state
  const [userAudioUrl, setUserAudioUrl] = useState<string | null>(null);
  const [isPlayingUserAudio, setIsPlayingUserAudio] = useState(false);
  const audioPlayerRef = useRef<HTMLAudioElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  // Sync default accent
  useEffect(() => {
    if (defaultAccent) setSelectedAccent(defaultAccent);
  }, [defaultAccent]);

  // Timer effect when listening
  useEffect(() => {
    let timer: any;
    if (isListening) {
      timer = setInterval(() => {
        setRecordingSeconds(prev => prev + 1);
      }, 1000);
    } else {
      setRecordingSeconds(0);
    }
    return () => clearInterval(timer);
  }, [isListening]);

  // Auto scroll textarea to bottom as live spoken text streams in
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.scrollTop = textareaRef.current.scrollHeight;
    }
  }, [transcript]);

  const toggleListening = async () => {
    setSpeechError(null);

    if (isListening) {
      setIsListening(false);
      const { blob, audioUrl } = await speechEngine.stop();
      if (audioUrl) {
        setUserAudioUrl(audioUrl);
      }

      // If Whisper AI mode is enabled and audioBlob exists and API key is present
      if (engineMode === 'whisper' && blob && apiKey) {
        setIsRefiningWithAI(true);
        const refinedText = await speechEngine.transcribeAudioWithAI(blob, apiKey);
        if (refinedText) {
          setTranscript(refinedText);
        }
        setIsRefiningWithAI(false);
      }
    } else {
      setUserAudioUrl(null);
      const supported = speechEngine.isSupported();
      if (!supported) {
        setSpeechError('Speech recognition is not supported in this browser. You can type or insert sample text below!');
        return;
      }

      const started = speechEngine.start({
        onStart: () => setIsListening(true),
        onResult: (text) => {
          setTranscript(text);
        },
        onError: (err) => {
          setIsListening(false);
          setSpeechError(err);
        },
        onEnd: () => setIsListening(false)
      }, selectedAccent);

      if (!started) {
        setIsListening(false);
      }
    }
  };

  const handleTogglePlayUserAudio = () => {
    if (!userAudioUrl) return;

    if (!audioPlayerRef.current) {
      audioPlayerRef.current = new Audio(userAudioUrl);
      audioPlayerRef.current.onended = () => setIsPlayingUserAudio(false);
    }

    if (isPlayingUserAudio) {
      audioPlayerRef.current.pause();
      setIsPlayingUserAudio(false);
    } else {
      audioPlayerRef.current.play().then(() => {
        setIsPlayingUserAudio(true);
      }).catch(err => console.error(err));
    }
  };

  const handleClear = () => {
    setTranscript('');
    setUserAudioUrl(null);
    setSpeechError(null);
  };

  const handleInsertSample = () => {
    const samples = [
      "In my previous project at the company, I was responsible for fixing the server outage. I go to the primary database, identified the bottleneck query, and executed a zero-downtime failover which helped the team very much.",
      "Maya Lin led a big company transition towards AI. She launched peer mentoring and got good results within one year, increasing revenue substantially.",
      "When engineers and product managers disagreed on feature priorities, I organized a tradeoff workshop. I showed data metrics, created alignment, and delivered the roadmap on time."
    ];
    const randomSample = samples[Math.floor(Math.random() * samples.length)];
    setTranscript(randomSample);
  };

  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  const accents = [
    { id: 'en-US', label: '🇺🇸 US' },
    { id: 'en-IN', label: '🇮🇳 IN' },
    { id: 'en-GB', label: '🇬🇧 UK' },
    { id: 'en-AU', label: '🇦🇺 AU' }
  ];

  return (
    <div className="w-full glass-card rounded-3xl border border-white/90 p-6 md:p-8 space-y-6 shadow-xl relative overflow-hidden text-slate-900">
      {/* Hero Header Context */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-4">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center p-1 border border-slate-700 shadow-sm shrink-0">
            <img src="/robot_assistant.svg" alt="Talk-a-Tron Robot Assistant" className="w-7 h-7 object-contain" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-slate-900 text-white">
                {modeLabel} Mode
              </span>
              <span className="text-xs font-bold text-slate-700">Talk-a-Tron Voice Assistant</span>
            </div>
            {speakingTask && (
              <p className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                <MessageSquareText className="w-4 h-4 text-slate-700" />
                <span>Task: {speakingTask}</span>
              </p>
            )}
          </div>
        </div>

        {/* Action Sample Button */}
        <button
          onClick={handleInsertSample}
          className="text-xs font-bold px-3.5 py-1.5 rounded-full border border-slate-300 bg-white text-slate-800 hover:bg-slate-100 transition flex items-center space-x-1.5 self-start sm:self-auto shadow-xs"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Insert Sample Speech</span>
        </button>
      </div>

      {/* Microphone Main Interactive Controls */}
      <div className="flex flex-col items-center justify-center space-y-4 py-2">
        {/* Engine Switcher Bar & Accent Selector */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {/* Engine Selector */}
          <div className="flex items-center space-x-1 p-1 rounded-full bg-slate-200/80 border border-slate-300 text-xs">
            <span className="px-2 text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Cpu className="w-3.5 h-3.5 text-slate-900" /> Speech Engine:
            </span>
            <button
              type="button"
              onClick={() => setEngineMode('webspeech')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                engineMode === 'webspeech'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              Live WebSpeech
            </button>
            <button
              type="button"
              onClick={() => setEngineMode('whisper')}
              className={`px-3 py-1 rounded-full text-xs font-bold transition ${
                engineMode === 'whisper'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-700 hover:text-slate-900'
              }`}
            >
              ⚡ Whisper AI
            </button>
          </div>

          {/* Accent Selector */}
          <div className="flex items-center space-x-1 p-1 rounded-full bg-slate-200/80 border border-slate-300 text-xs">
            <span className="px-2 text-[11px] font-bold text-slate-700 flex items-center gap-1">
              <Globe className="w-3.5 h-3.5 text-slate-900" /> Accent:
            </span>
            {accents.map(acc => (
              <button
                key={acc.id}
                type="button"
                onClick={() => setSelectedAccent(acc.id)}
                disabled={isListening}
                className={`px-2.5 py-1 rounded-full text-xs font-bold transition ${
                  selectedAccent === acc.id
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'text-slate-700 hover:text-slate-900'
                }`}
              >
                {acc.label}
              </button>
            ))}
          </div>
        </div>

        <div className="relative">
          {/* Ripple Wave Outer Animation */}
          {isListening && (
            <>
              <div className="absolute inset-0 rounded-full bg-rose-500/20 animate-ping pointer-events-none" />
              <div className="absolute -inset-4 rounded-full border-2 border-rose-500/40 animate-pulse-slow pointer-events-none" />
            </>
          )}

          <button
            onClick={toggleListening}
            className={`relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300 shadow-xl ${
              isListening
                ? 'bg-rose-600 text-white shadow-rose-500/40 scale-105'
                : 'bg-slate-900 text-white hover:bg-slate-800 hover:scale-105'
            }`}
          >
            {isListening ? (
              <MicOff className="w-10 h-10 text-white animate-pulse" />
            ) : (
              <Mic className="w-10 h-10 text-white" />
            )}
            <span className="text-[10px] font-extrabold text-white uppercase tracking-wider mt-1">
              {isListening ? 'Stop' : 'Talk'}
            </span>
          </button>
        </div>

        {/* Status Indicator & Live Timer */}
        <div className="text-center space-y-1">
          <div className="flex items-center justify-center space-x-2 text-xs font-bold">
            <span className={`w-2 h-2 rounded-full ${isListening ? 'bg-rose-500 animate-ping' : 'bg-slate-400'}`} />
            <span className={isListening ? 'text-rose-600 font-bold' : 'text-slate-700'}>
              {isListening
                ? `Listening (${formatTime(recordingSeconds)})...`
                : isRefiningWithAI
                  ? '⚡ Refining transcript with Whisper AI...'
                  : 'Tap "Talk" & start speaking'}
            </span>
          </div>
          <AudioVisualizer isRecording={isListening} />
        </div>

        {/* Interactive Recorded Audio Player Bar */}
        {userAudioUrl && !isListening && (
          <div className="p-3 rounded-2xl bg-white border border-slate-300 flex items-center space-x-3 text-xs shadow-md animate-fadeIn w-full max-w-sm">
            <button
              type="button"
              onClick={handleTogglePlayUserAudio}
              className={`p-2.5 rounded-full border flex items-center justify-center transition ${
                isPlayingUserAudio
                  ? 'bg-slate-900 text-white border-slate-900 animate-pulse'
                  : 'btn-dark'
              }`}
            >
              {isPlayingUserAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-white" />}
            </button>
            <div className="flex-1">
              <div className="font-extrabold text-slate-900 flex items-center justify-between">
                <span className="flex items-center gap-1 text-slate-900">
                  <Volume2 className="w-3.5 h-3.5" />
                  {isPlayingUserAudio ? 'Playing Your Recording...' : 'Listen to Your Recording'}
                </span>
              </div>
              <p className="text-[11px] text-slate-600 font-medium">Replay your microphone speech audio</p>
            </div>
          </div>
        )}
      </div>

      {/* Error Alert if any */}
      {speechError && (
        <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center space-x-2 font-semibold">
          <AlertCircle className="w-4 h-4 text-amber-600 shrink-0" />
          <span>{speechError}</span>
        </div>
      )}

      {/* Live Transcript Display Box */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-xs font-bold">
          <span className="flex items-center space-x-1.5 text-slate-700">
            <Radio className={`w-3.5 h-3.5 ${isListening ? 'text-rose-600 animate-pulse' : 'text-slate-500'}`} />
            <span>Spoken Transcript {isListening && <strong className="text-rose-600 font-bold">• Recording Live</strong>}</span>
          </span>
          <div className="flex items-center space-x-3">
            <span className="text-[11px] text-slate-500 flex items-center gap-1">
              <Edit3 className="w-3 h-3 text-slate-600" /> Editable
            </span>
            {transcript && (
              <button
                onClick={handleClear}
                className="flex items-center space-x-1 text-slate-600 hover:text-slate-900 transition"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Clear</span>
              </button>
            )}
          </div>
        </div>

        <textarea
          ref={textareaRef}
          rows={3}
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
          placeholder="Your spoken words will appear here in real time... You can also edit or correct any word directly!"
          className="w-full p-4 rounded-2xl bg-white border border-slate-300 text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:border-slate-900 transition text-sm leading-relaxed resize-none"
        />
      </div>

      {/* Analyze Action Trigger */}
      <div className="flex justify-end pt-2">
        <button
          onClick={() => onAnalyze(transcript, userAudioUrl || undefined)}
          disabled={!transcript.trim() || isAnalyzing}
          className={`px-8 py-3 rounded-full font-bold text-xs uppercase tracking-wider flex items-center space-x-2 shadow-lg transition-all ${
            !transcript.trim() || isAnalyzing
              ? 'bg-slate-300 text-slate-500 cursor-not-allowed border border-slate-300'
              : 'btn-dark'
          }`}
        >
          {isAnalyzing ? (
            <>
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Evaluating Speech...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-400" />
              <span>Analyze & Get AI Feedback</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
