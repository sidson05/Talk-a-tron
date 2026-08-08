import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_FILE = path.join(__dirname, 'data', 'store.json');

// Ensure data folder exists
if (!fs.existsSync(path.join(__dirname, 'data'))) {
  fs.mkdirSync(path.join(__dirname, 'data'), { recursive: true });
}

// Clean Real-Time DB state (No dummy fake stats)
let db = {
  sessions: [],
  userStats: {
    currentStreak: 0,
    bestStreak: 0,
    totalMinutesSpoken: 0,
    totalSessionsCompleted: 0,
    avgGrammarScore: 0,
    avgStarScore: 0,
    lastPracticedDate: '',
    savedWordIds: []
  }
};

// Load existing JSON database
if (fs.existsSync(DATA_FILE)) {
  try {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    db = JSON.parse(raw);
  } catch (err) {
    console.error('Failed to load store.json, using fresh store.', err);
  }
}

const saveDB = () => {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(db, null, 2), 'utf-8');
  } catch (err) {
    console.error('Failed to persist store.json', err);
  }
};

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 4000;

// Dynamic Daily 10 Words Engine from Backend
const COMPREHENSIVE_WORD_BANK = [
  {
    word: 'Articulate',
    phonetic: '/ɑːrˈtɪkjuleɪt/',
    partOfSpeech: 'adjective / verb',
    definition: 'Expressing thoughts or feelings fluently and coherently.',
    example: 'She was able to articulate the complex roadmap to non-technical stakeholders.',
    synonym: 'Eloquent, Coherent',
    difficulty: 'Executive'
  },
  {
    word: 'Pragmatic',
    phonetic: '/præɡˈmætɪk/',
    partOfSpeech: 'adjective',
    definition: 'Dealing with things sensibly and realistically based on practical considerations.',
    example: 'The team took a pragmatic approach by launching an MVP before full automation.',
    synonym: 'Practical, Sensible',
    difficulty: 'Advanced'
  },
  {
    word: 'Ubiquitous',
    phonetic: '/juːˈbɪkwɪtəs/',
    partOfSpeech: 'adjective',
    definition: 'Present, appearing, or found everywhere simultaneously.',
    example: 'Cloud computing has become ubiquitous across technology companies.',
    synonym: 'Omnipresent, Pervasive',
    difficulty: 'Executive'
  },
  {
    word: 'Quintessential',
    phonetic: '/ˌkwɪntɪˈsenʃl/',
    partOfSpeech: 'adjective',
    definition: 'Representing the most perfect or typical example of a quality.',
    example: 'His problem-solving style is the quintessential example of tech leadership.',
    synonym: 'Archetypal, Classic',
    difficulty: 'Executive'
  },
  {
    word: 'Catalyst',
    phonetic: '/ˈkætəlɪst/',
    partOfSpeech: 'noun',
    definition: 'A person or thing that precipitates an event or accelerates change.',
    example: 'The customer feedback session served as a catalyst for restructuring onboarding.',
    synonym: 'Stimulant, Spark',
    difficulty: 'Business'
  },
  {
    word: 'Resilient',
    phonetic: '/rɪˈzɪliənt/',
    partOfSpeech: 'adjective',
    definition: 'Able to withstand or recover quickly from difficult conditions.',
    example: 'A resilient infrastructure gracefully handles sudden traffic spikes.',
    synonym: 'Tough, Adaptable',
    difficulty: 'Business'
  },
  {
    word: 'Nuanced',
    phonetic: '/ˈnjuːɑːnst/',
    partOfSpeech: 'adjective',
    definition: 'Characterized by subtle shades of meaning or complex detail.',
    example: 'Evaluating team performance requires a nuanced understanding of individual metrics.',
    synonym: 'Subtle, Refined',
    difficulty: 'Advanced'
  },
  {
    word: 'Paramount',
    phonetic: '/ˈpærəmaʊnt/',
    partOfSpeech: 'adjective',
    definition: 'More important than anything else; supreme in significance.',
    example: 'Ensuring user data privacy is of paramount importance to our platform.',
    synonym: 'Preeminent, Vital',
    difficulty: 'Executive'
  },
  {
    word: 'Exemplary',
    phonetic: '/ɪɡˈzempləri/',
    partOfSpeech: 'adjective',
    definition: 'Serving as a desirable model or representing the best of its kind.',
    example: 'Her exemplary communication set a benchmark for the team.',
    synonym: 'Commendable, Model',
    difficulty: 'Business'
  },
  {
    word: 'Empirical',
    phonetic: '/ɪmˈpɪrɪkl/',
    partOfSpeech: 'adjective',
    definition: 'Based on, concerned with, or verifiable by observation or experiment.',
    example: 'We made our architecture decision based on empirical benchmarks.',
    synonym: 'Observational, Evidence-based',
    difficulty: 'Advanced'
  },
  {
    word: 'Meticulous',
    phonetic: '/mɪˈtɪkjələs/',
    partOfSpeech: 'adjective',
    definition: 'Showing great attention to detail; very careful and precise.',
    example: 'Meticulous code reviews prevented bugs from reaching production.',
    synonym: 'Scrupulous, Precise',
    difficulty: 'Advanced'
  },
  {
    word: 'Cognizant',
    phonetic: '/ˈkɑːɡnɪzənt/',
    partOfSpeech: 'adjective',
    definition: 'Having knowledge or being aware of something.',
    example: 'The team remains cognizant of evolving compliance requirements.',
    synonym: 'Aware, Mindful',
    difficulty: 'Executive'
  }
];

const getDailyWords = (dateKey) => {
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  const startIndex = Math.abs(hash) % COMPREHENSIVE_WORD_BANK.length;
  const selected = [];
  for (let i = 0; i < 10; i++) {
    const wordIdx = (startIndex + i) % COMPREHENSIVE_WORD_BANK.length;
    selected.push({
      ...COMPREHENSIVE_WORD_BANK[wordIdx],
      id: `w-${dateKey}-${i + 1}`
    });
  }
  return selected;
};

// Compute performance metrics from actual session history
const calculatePerformanceStats = (sessions) => {
  if (!sessions || sessions.length === 0) {
    return {
      currentStreak: 0,
      bestStreak: 0,
      totalMinutesSpoken: 0,
      totalSessionsCompleted: 0,
      avgGrammarScore: 0,
      avgStarScore: 0,
      lastPracticedDate: '',
      savedWordIds: db.userStats.savedWordIds || []
    };
  }

  const totalSessionsCompleted = sessions.length;

  // Calculate actual total spoken minutes based on word counts (average 130 wpm or 1 min min per session)
  let totalWords = 0;
  let totalFluencyScore = 0;
  let starSessions = [];

  sessions.forEach(s => {
    const words = (s.originalTranscript || '').split(/\s+/).filter(Boolean).length;
    totalWords += Math.max(15, words);
    totalFluencyScore += (s.fluencyScore || 75);
    if (s.starAnalysis && typeof s.starAnalysis.overallScore === 'number') {
      starSessions.push(s.starAnalysis.overallScore);
    }
  });

  const totalMinutesSpoken = Math.max(totalSessionsCompleted, Math.round(totalWords / 120));
  const avgGrammarScore = Math.round(totalFluencyScore / totalSessionsCompleted);
  const avgStarScore = starSessions.length > 0
    ? Math.round(starSessions.reduce((a, b) => a + b, 0) / starSessions.length)
    : 0;

  // Calculate real date-based streak from actual sessions timestamps
  const uniqueDates = Array.from(new Set(sessions.map(s => {
    return (s.timestamp || new Date().toISOString()).split('T')[0];
  }))).sort().reverse();

  let currentStreak = 0;
  const today = new Date().toISOString().split('T')[0];

  if (uniqueDates.length > 0) {
    let checkDate = new Date();
    let dStr = checkDate.toISOString().split('T')[0];

    // Check if practiced today or yesterday to maintain active streak
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
    bestStreak: Math.max(currentStreak, db.userStats.bestStreak || 0),
    totalMinutesSpoken,
    totalSessionsCompleted,
    avgGrammarScore,
    avgStarScore,
    lastPracticedDate: uniqueDates[0] || '',
    savedWordIds: db.userStats.savedWordIds || []
  };
};

// API Endpoints

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', app: 'Talk-a-Tron Persistent API Server', totalSessionsLogged: db.sessions.length });
});

// Fetch all recorded voice practice sessions
app.get('/api/sessions', (req, res) => {
  res.json({ sessions: db.sessions });
});

// Save a new voice practice session event to backend database
app.post('/api/sessions', (req, res) => {
  const session = req.body;
  if (!session || !session.originalTranscript) {
    return res.status(400).json({ error: 'Invalid session payload' });
  }

  const newSession = {
    ...session,
    id: session.id || 'fb-' + Date.now(),
    timestamp: session.timestamp || new Date().toISOString()
  };

  // Add to top of array
  db.sessions.unshift(newSession);

  // Recalculate stats dynamically from real sessions
  db.userStats = calculatePerformanceStats(db.sessions);

  saveDB();
  res.json({ status: 'saved', session: newSession, stats: db.userStats });
});

// Delete specific session
app.delete('/api/sessions/:id', (req, res) => {
  const { id } = req.params;
  db.sessions = db.sessions.filter(s => s.id !== id);
  db.userStats = calculatePerformanceStats(db.sessions);
  saveDB();
  res.json({ status: 'deleted', id });
});

// Clear all sessions
app.delete('/api/sessions', (req, res) => {
  db.sessions = [];
  db.userStats = calculatePerformanceStats([]);
  saveDB();
  res.json({ status: 'cleared' });
});

// Dynamic Daily 10 Words endpoint - changes automatically every calendar day!
app.get('/api/vocabulary/today', (req, res) => {
  const dateStr = req.query.date || new Date().toISOString().split('T')[0];
  const words = getDailyWords(dateStr);
  res.json({ date: dateStr, words });
});

// Get overall stats
app.get('/api/stats', (req, res) => {
  db.userStats = calculatePerformanceStats(db.sessions);
  res.json(db.userStats);
});

app.listen(PORT, () => {
  console.log(`Talk-Coach Persistent API Backend listening on http://localhost:${PORT}`);
});
