// Dual-Engine Speech Recognition & Synthesis Service (WebSpeech + MediaRecorder AI Whisper)

export interface SpeechRecognitionHandlers {
  onResult: (transcript: string, isFinal: boolean) => void;
  onError: (error: string) => void;
  onStart?: () => void;
  onEnd?: () => void;
}

export interface StopRecordingResult {
  blob: Blob | null;
  audioUrl: string | null;
}

export class SpeechEngine {
  private recognition: any = null;
  private isListeningActive: boolean = false;
  private mediaRecorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  private mediaStream: MediaStream | null = null;

  public isSupported(): boolean {
    return !!((window as any).SpeechRecognition || (window as any).webkitSpeechRecognition);
  }

  // Engine 1: Web Speech API Live Streamer & Mic Capture
  public start(handlers: SpeechRecognitionHandlers, lang: string = 'en-US'): boolean {
    const SpeechRec = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;

    try {
      // Start high-quality MediaRecorder stream to record user's audio for playback
      this.startMediaStream().catch(() => {});

      if (SpeechRec) {
        if (this.recognition) {
          try { this.recognition.abort(); } catch (e) {}
        }

        this.recognition = new SpeechRec();
        this.recognition.continuous = true;
        this.recognition.interimResults = true;
        this.recognition.maxAlternatives = 3;
        this.recognition.lang = lang || 'en-US';
        this.isListeningActive = true;

        this.recognition.onstart = () => {
          if (handlers.onStart) handlers.onStart();
        };

        this.recognition.onresult = (event: any) => {
          let fullTranscript = '';

          for (let i = 0; i < event.results.length; i++) {
            const rawPhrase = event.results[i][0].transcript;
            const phrase = rawPhrase.trim();

            if (phrase) {
              if (fullTranscript && !fullTranscript.endsWith(' ') && !phrase.startsWith(' ')) {
                fullTranscript += ' ';
              }
              fullTranscript += phrase;
            }
          }

          const lastResult = event.results[event.results.length - 1];
          const isFinal = lastResult ? lastResult.isFinal : false;

          if (fullTranscript.trim()) {
            handlers.onResult(fullTranscript, isFinal);
          }
        };

        this.recognition.onerror = (event: any) => {
          console.warn('Speech recognition error event:', event.error);
          if (event.error === 'no-speech') return;
          if (event.error === 'not-allowed') {
            this.isListeningActive = false;
            if (handlers.onError) handlers.onError('Microphone permission denied. Please enable mic access.');
            return;
          }
          if (handlers.onError) {
            handlers.onError(`Speech notice: ${event.error}`);
          }
        };

        this.recognition.onend = () => {
          if (this.isListeningActive && this.recognition) {
            try {
              this.recognition.start();
              return;
            } catch (e) {
              // ignore
            }
          }
          this.isListeningActive = false;
          if (handlers.onEnd) handlers.onEnd();
        };

        this.recognition.start();
      }

      return true;
    } catch (e: any) {
      console.error('Failed to start speech recognition engine:', e);
      this.isListeningActive = false;
      if (handlers.onError) handlers.onError('Failed to access microphone.');
      return false;
    }
  }

  // MediaRecorder Audio Stream for User Voice Playback
  private async startMediaStream(): Promise<void> {
    try {
      this.audioChunks = [];
      this.mediaStream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      });
      const mimeType = MediaRecorder.isTypeSupported('audio/webm') ? 'audio/webm' : 'audio/ogg';
      this.mediaRecorder = new MediaRecorder(this.mediaStream, { mimeType });
      this.mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) this.audioChunks.push(e.data);
      };
      this.mediaRecorder.start(100);
    } catch (e) {
      console.warn('MediaRecorder audio stream fallback:', e);
    }
  }

  public async stop(): Promise<StopRecordingResult> {
    this.isListeningActive = false;
    if (this.recognition) {
      try { this.recognition.stop(); } catch (e) {
        try { this.recognition.abort(); } catch (err) {}
      }
    }

    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      return new Promise((resolve) => {
        this.mediaRecorder!.onstop = () => {
          const blob = new Blob(this.audioChunks, { type: 'audio/webm' });
          const audioUrl = URL.createObjectURL(blob);
          if (this.mediaStream) {
            this.mediaStream.getTracks().forEach(t => t.stop());
          }
          resolve({ blob, audioUrl });
        };
        this.mediaRecorder!.stop();
      });
    }

    return { blob: null, audioUrl: null };
  }

  // AI Whisper Audio Transcriber
  public async transcribeAudioWithAI(audioBlob: Blob, apiKey: string): Promise<string | null> {
    try {
      const formData = new FormData();
      formData.append('file', audioBlob, 'audio.webm');
      formData.append('model', 'whisper-1');
      formData.append('language', 'en');

      const res = await fetch('https://api.openai.com/v1/audio/transcriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`
        },
        body: formData
      });

      if (!res.ok) throw new Error(`Whisper API HTTP ${res.status}`);
      const data = await res.json();
      return data.text ? data.text.trim() : null;
    } catch (e) {
      console.warn('Whisper AI transcription fallback:', e);
      return null;
    }
  }

  // High-Quality Text-To-Speech (Prioritizes Microsoft Edge Neural & Natural Voices)
  public speak(text: string, settings: { accent?: string; rate?: number; pitch?: number; onEnd?: () => void } = {}): void {
    if (!('speechSynthesis' in window)) {
      console.warn('Speech synthesis not supported in this browser.');
      return;
    }

    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = settings.rate || 0.95;
    utterance.pitch = settings.pitch || 1.0;

    const voices = window.speechSynthesis.getVoices();
    if (voices.length > 0) {
      const accent = settings.accent || 'en-US';

      // 1. Prioritize Microsoft Edge Neural & Natural Voices (e.g. Aria, Guy, Neerja, Sonia)
      let selectedVoice = voices.find(v =>
        (v.name.includes('Neural') || v.name.includes('Natural') || v.name.includes('Online')) &&
        (v.lang.startsWith(accent) || v.lang === accent)
      );

      // 2. Fallback to Google / Premium voices
      if (!selectedVoice) {
        selectedVoice = voices.find(v =>
          (v.name.includes('Google') || v.name.includes('Premium')) &&
          (v.lang.startsWith(accent) || v.lang === accent)
        );
      }

      // 3. Fallback to any voice matching accent
      if (!selectedVoice) {
        selectedVoice = voices.find(v => v.lang.startsWith(accent) || v.lang === accent);
      }

      if (selectedVoice) {
        utterance.voice = selectedVoice;
      }
    }

    if (settings.onEnd) {
      utterance.onend = () => settings.onEnd!();
    }

    window.speechSynthesis.speak(utterance);
  }

  public stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}

export const speechEngine = new SpeechEngine();
