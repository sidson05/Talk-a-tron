export type PracticeMode = 'story' | 'interview' | 'free' | 'cognitive';

export type CognitiveModeType = 
  | 'logical' 
  | 'critical' 
  | 'case_study' 
  | 'aptitude_verbal' 
  | 'think_aloud' 
  | 'ai_debate' 
  | 'fermi_estimation' 
  | 'product_sense' 
  | 'systems_thinking' 
  | 'ethical_decisions';

export interface GrammarError {
  id: string;
  type: 'Article' | 'Verb Tense' | 'Preposition' | 'Word Choice' | 'Punctuation' | 'Sentence Structure' | 'Agreement';
  original: string;
  replacement: string;
  explanation: string;
}

export interface VocabularyUpgrade {
  id: string;
  original: string;
  upgraded: string;
  registerLevel: 'Executive' | 'Advanced' | 'Formal' | 'Academic';
  explanation: string;
}

export interface StarAnalysis {
  situationScore: number; // 0-100
  taskScore: number;      // 0-100
  actionScore: number;    // 0-100
  resultScore: number;    // 0-100
  overallScore: number;   // 0-100
  situationFeedback: string;
  taskFeedback: string;
  actionFeedback: string;
  resultFeedback: string;
  keyStrengths: string[];
  improvementTips: string[];
  modelAnswer?: string; // Ideal high-scoring STAR answer provided after completion
}

export interface ChartData {
  title: string;
  subtitle: string;
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    color?: string;
  }[];
  chartType: 'bar' | 'line';
}

export interface CognitiveRubricScore {
  logicalReasoning: number; // 0.0 - 10.0
  criticalThinking: number;  // 0.0 - 10.0
  problemSolving: number;    // 0.0 - 10.0
  communication: number;     // 0.0 - 10.0
  vocabulary: number;        // 0.0 - 10.0
  grammar: number;           // 0.0 - 10.0
  confidence: number;        // 0.0 - 10.0
  fluency: number;           // 0.0 - 10.0
}

export interface CognitiveScorecard {
  modeType: CognitiveModeType;
  rubric: CognitiveRubricScore;
  overallScore: number; // 0-100
  stepByStepSolution?: string;
  reasoningFlawDiagnostic?: string;
  aiCounterargument?: string; // For AI Debate mode
  strongerArguments: string[];
  vocabularySuggestions: string[];
  nextRecommendedLevel: 'Level 1: Beginner' | 'Level 2: Intermediate' | 'Level 3: Advanced' | 'Level 4: Lead' | 'Level 5: Executive';
}

export interface SpeechFeedback {
  id: string;
  mode: PracticeMode;
  originalTranscript: string;
  correctedText: string;
  grammarErrors: GrammarError[];
  vocabularyUpgrades: VocabularyUpgrade[];
  fluencyScore: number; // 0-100
  starAnalysis?: StarAnalysis;
  cognitiveScorecard?: CognitiveScorecard;
  promptTitle?: string;
  userAudioUrl?: string; // Blob URL / Data URL of user's own recorded microphone audio
  timestamp: string;
}

export interface WordOfDay {
  id: string;
  word: string;
  phonetic: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  synonym: string;
  audioUrl?: string;
  difficulty: 'Business' | 'Advanced' | 'Executive';
  bookmarked?: boolean;
}

export interface UserStats {
  currentStreak: number;
  bestStreak: number;
  totalMinutesSpoken: number;
  totalSessionsCompleted: number;
  avgGrammarScore: number;
  avgStarScore: number;
  lastPracticedDate: string;
  savedWordIds: string[];
  history: SpeechFeedback[];
}

export interface VoiceSettings {
  accent: 'en-US' | 'en-GB' | 'en-AU' | 'en-IN';
  rate: number; // 0.75 - 1.25
  pitch: number; // 0.8 - 1.2
  autoPlayTTS: boolean;
  apiKey: string;
  apiProvider: 'mock' | 'openai' | 'gemini';
  themeStyle?: 'emerald' | 'aurora' | 'cyber' | 'sunset';
}

export interface StoryPrompt {
  id: string;
  title: string;
  category: 'Business & Tech' | 'Leadership' | 'Daily Life' | 'Creative' | 'Philosophy';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  text: string;
  speakingTask: string;
}

export interface InterviewQuestion {
  id: string;
  role: 'General' | 'Software Engineering' | 'Product Management' | 'Leadership' | 'Data Science' | 'Customer Success';
  category: 'Conflict Resolution' | 'Problem Solving' | 'Leadership' | 'Failure & Learning' | 'Prioritization';
  question: string;
  starTips: {
    situation: string;
    task: string;
    action: string;
    result: string;
  };
  modelAnswer?: string; // Exemplar STAR model answer
}

export interface CognitiveQuestion {
  id: string;
  modeType: CognitiveModeType;
  modeCategory: 'Logical & Aptitude' | 'Debate & Verbal' | 'Tech & Product Strategy' | 'Leadership & Judgment';
  title: string;
  question: string;
  contextText?: string;
  chartData?: ChartData;
  level: 'Level 1: Beginner' | 'Level 2: Intermediate' | 'Level 3: Advanced' | 'Level 4: Lead' | 'Level 5: Executive';
  stepByStepSolution: string;
  keyEvaluationCriteria: string[];
}
