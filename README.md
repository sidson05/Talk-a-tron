# 🤖 Talk-a-Tron — Voice AI Speaking, STAR Interview & Cognitive Reasoning Coach

**Talk-a-Tron** is an executive-grade Voice AI speaking coach and cognitive reasoning simulator designed to help users master English fluency, high-stakes STAR behavioral interviews, executive pitch debates, Fermi estimates, and technical problem-solving.

![Talk-a-Tron UI](public/neurova_forest_bg.png)

---

## 🌟 Key Features

### 🎙️ 1. Real-Time Speech Recorder & Voice Replay
- High-accuracy speech recognition via WebSpeech API & OpenAI Whisper AI.
- Full microphone playback so users can listen back to their recorded audio speech.
- Real-time audio frequency visualizer waveform.
- Multi-accent support (US 🇺🇸, IN 🇮🇳, UK 🇬🇧, AU 🇦🇺).

### 🏆 2. STAR Behavioral Interview Simulator
- Role-specific interview scenarios (Product Manager, Software Engineer, Data Analyst, UX Designer, Executive Leader).
- Recommended STAR (Situation, Task, Action, Result) structuring checklist.
- AI evaluation with exemplar top 1% candidate STAR model answers & TTS narration.

### 🧠 3. Cognitive & Executive Reasoning Lab (10 Modes)
- **Logical & Aptitude**: Number/letter series, coding-decoding, blood relations, direction sense, seating arrangement, syllogisms, data sufficiency, and live SVG data chart visualizer.
- **Critical Thinking & AI Debate**: Verbal argumentation scoring (Clarity, Structure, Evidence, Counterarguments, Confidence, Persuasiveness) with real-time AI counter-challenges.
- **Tech & Product Strategy Case Studies**: High-pressure incident resolution & product architecture trade-offs.
- **Leadership & Judgment**: Crisis navigation, executive decision making, and team management under uncertainty.
- **10-Skill Rubric Scorecard**: Quantitative breakdown across Logical Reasoning, Critical Thinking, Problem Solving, Communication, Vocabulary, Grammar, Confidence, and Fluency.

### 📖 4. Daily Story Retelling Coach
- Curated library of real-world business, tech, leadership, daily life, and philosophy stories.
- AI voice narration preview.
- Retelling task prompts with instant grammar correction and executive vocabulary upgrades.

### 📚 5. Daily 10-Words Vocabulary Pack
- Auto-rotating daily 10-word vocabulary set based on calendar date.
- 3D flip flashcards & interactive vocabulary quizzes.
- One-click bookmark gallery.

### 📊 6. Analytics, History & Persistent Tracking
- Real performance metrics: streaks, talking time, average fluency rating, and STAR readiness.
- Persistent Express API server (`server/index.js`) with local JSON storage (`server/data/store.json`).
- Searchable voice practice history log with side-by-side original vs. corrected speech comparison.

### 🎨 7. Neurova Light Organic Glass Theme
- Pine forest & mountain lake watercolor wallpaper backdrop (`public/neurova_forest_bg.png`).
- Translucent light frosted glass container system (`backdrop-filter: blur(32px)`).
- Cute AI Robot Assistant avatar (`public/robot_assistant.svg`).
- React Portal viewport-centered modal dialogs (`createPortal`).

---

## 🛠️ Technology Stack

- **Frontend**: React 18, TypeScript, Vite, Tailwind CSS, Lucide Icons, Canvas Confetti.
- **Voice & Speech**: WebSpeech API, Web Audio API, Web MediaRecorder, OpenAI Whisper API.
- **AI Engine**: Google Gemini API (`gemini-2.5-flash`).
- **Backend API**: Node.js, Express, CORS, Persistent file storage.

---

## 🚀 Getting Started

### 1. Installation

```bash
# Clone repository
git clone https://github.com/sidson05/Talk-a-tron.git
cd Talk-a-tron

# Install dependencies
npm install
```

### 2. Running Locally

```bash
# Start frontend Vite dev server (runs on http://localhost:5173/)
npm run dev

# Start backend Express server (runs on http://localhost:4000/)
npm run server
```

### 3. Build for Production

```bash
npm run build
```

---

## 📄 License

MIT License © 2026 Talk-a-Tron Team
