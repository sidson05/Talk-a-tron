import type { WordOfDay } from '../types';

export const COMPREHENSIVE_WORD_BANK: Omit<WordOfDay, 'id'>[] = [
  {
    word: 'Articulate',
    phonetic: '/ɑːrˈtɪkjuleɪt/',
    partOfSpeech: 'adjective / verb',
    definition: 'Expressing thoughts or feelings fluently and coherently.',
    example: 'She was able to articulate the complex architectural roadmap to non-technical stakeholders.',
    synonym: 'Eloquent, Coherent, Expressive',
    difficulty: 'Executive',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/articulate-us.mp3'
  },
  {
    word: 'Pragmatic',
    phonetic: '/præɡˈmætɪk/',
    partOfSpeech: 'adjective',
    definition: 'Dealing with things sensibly and realistically based on practical considerations.',
    example: 'The team took a pragmatic approach by launching an MVP before investing in full automation.',
    synonym: 'Practical, Sensible, Down-to-earth',
    difficulty: 'Advanced',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/pragmatic-us.mp3'
  },
  {
    word: 'Ubiquitous',
    phonetic: '/juːˈbɪkwɪtəs/',
    partOfSpeech: 'adjective',
    definition: 'Present, appearing, or found everywhere simultaneously.',
    example: 'Cloud computing has become ubiquitous across modern technology companies worldwide.',
    synonym: 'Omnipresent, Pervasive, Universal',
    difficulty: 'Executive',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/ubiquitous-us.mp3'
  },
  {
    word: 'Quintessential',
    phonetic: '/ˌkwɪntɪˈsenʃl/',
    partOfSpeech: 'adjective',
    definition: 'Representing the most perfect or typical example of a quality or class.',
    example: 'His methodical problem-solving style is the quintessential example of effective tech leadership.',
    synonym: 'Archetypal, Classic, Definitive',
    difficulty: 'Executive',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/quintessential-us.mp3'
  },
  {
    word: 'Catalyst',
    phonetic: '/ˈkætəlɪst/',
    partOfSpeech: 'noun',
    definition: 'A person or thing that precipitates an event or accelerates change without being consumed.',
    example: 'The customer feedback session served as a catalyst for restructuring our onboarding flow.',
    synonym: 'Stimulant, Spark, Impetus',
    difficulty: 'Business',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/catalyst-us.mp3'
  },
  {
    word: 'Resilient',
    phonetic: '/rɪˈzɪliənt/',
    partOfSpeech: 'adjective',
    definition: 'Able to withstand or recover quickly from difficult conditions or unexpected setbacks.',
    example: 'A resilient engineering infrastructure gracefully handles sudden traffic spikes and node failures.',
    synonym: 'Tough, Adaptable, Durable',
    difficulty: 'Business',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/resilient-us.mp3'
  },
  {
    word: 'Nuanced',
    phonetic: '/ˈnjuːɑːnst/',
    partOfSpeech: 'adjective',
    definition: 'Characterized by subtle shades of meaning, expression, or complex detail.',
    example: 'Evaluating team performance requires a nuanced understanding of individual contributions.',
    synonym: 'Subtle, Refined, Complex',
    difficulty: 'Advanced',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/nuanced-us.mp3'
  },
  {
    word: 'Paramount',
    phonetic: '/ˈpærəmaʊnt/',
    partOfSpeech: 'adjective',
    definition: 'More important than anything else; supreme in ranking or significance.',
    example: 'Ensuring user data privacy and security is of paramount importance to our company.',
    synonym: 'Preeminent, Supreme, Vital',
    difficulty: 'Executive',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/paramount-us.mp3'
  },
  {
    word: 'Exemplary',
    phonetic: '/ɪɡˈzempləri/',
    partOfSpeech: 'adjective',
    definition: 'Serving as a desirable model or representing the best of its kind.',
    example: 'Her exemplary communication during the project crisis set a benchmark for the department.',
    synonym: 'Commendable, Outstanding, Model',
    difficulty: 'Business',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/exemplary-us.mp3'
  },
  {
    word: 'Empirical',
    phonetic: '/ɪmˈpɪrɪkl/',
    partOfSpeech: 'adjective',
    definition: 'Based on, concerned with, or verifiable by observation or experiment rather than theory.',
    example: 'We made our architecture decision based on empirical benchmarks rather than subjective opinions.',
    synonym: 'Observational, Experimental, Evidence-based',
    difficulty: 'Advanced',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/empirical-us.mp3'
  },
  {
    word: 'Meticulous',
    phonetic: '/mɪˈtɪkjələs/',
    partOfSpeech: 'adjective',
    definition: 'Showing great attention to detail; very careful and precise.',
    example: 'His meticulous code reviews prevented multiple edge-case bugs from reaching production.',
    synonym: 'Scrupulous, Painstaking, Precise',
    difficulty: 'Advanced'
  },
  {
    word: 'Cognizant',
    phonetic: '/ˈkɑːɡnɪzənt/',
    partOfSpeech: 'adjective',
    definition: 'Having knowledge or being aware of something.',
    example: 'The product team remains cognizant of evolving regulatory compliance requirements.',
    synonym: 'Aware, Mindful, Conscious',
    difficulty: 'Executive'
  },
  {
    word: 'Ephemeral',
    phonetic: '/ɪˈfemərəl/',
    partOfSpeech: 'adjective',
    definition: 'Lasting for a very short time; fleeting.',
    example: 'The initial market hype proved ephemeral, but core utility kept active users engaged.',
    synonym: 'Transient, Fleeting, Momentary',
    difficulty: 'Advanced'
  },
  {
    word: 'Fastidious',
    phonetic: '/fæˈstɪdiəs/',
    partOfSpeech: 'adjective',
    definition: 'Very attentive to and concerned about accuracy and detail.',
    example: 'She is fastidious about maintaining clean documentation for all microservice APIs.',
    synonym: 'Meticulous, Exacting, Demanding',
    difficulty: 'Executive'
  },
  {
    word: 'Obfuscate',
    phonetic: '/ˈɑːbfəskeɪt/',
    partOfSpeech: 'verb',
    definition: 'To render obscure, unclear, or unintelligible.',
    example: 'Avoid overly complex technical jargon that might obfuscate the core business proposal.',
    synonym: 'Obscure, Confuse, Cloud',
    difficulty: 'Advanced'
  },
  {
    word: 'Proactive',
    phonetic: '/proʊˈæktɪv/',
    partOfSpeech: 'adjective',
    definition: 'Creating or controlling a situation by causing something to happen rather than responding after it has occurred.',
    example: 'The proactive monitoring system alerted engineers before the database memory limit was exceeded.',
    synonym: 'Enterprising, Action-oriented',
    difficulty: 'Business'
  },
  {
    word: 'Synergy',
    phonetic: '/ˈsɪnərdʒi/',
    partOfSpeech: 'noun',
    definition: 'The interaction or cooperation of two or more organizations or agents to produce a combined effect greater than the sum of their separate effects.',
    example: 'The merger created operational synergy between the engineering and marketing teams.',
    synonym: 'Collaboration, Harmony, Cohesion',
    difficulty: 'Business'
  },
  {
    word: 'Consensus',
    phonetic: '/kənˈsensəs/',
    partOfSpeech: 'noun',
    definition: 'A general agreement reached by a group.',
    example: 'After a two-hour deliberation, the leadership committee reached a consensus on the Q3 strategic priorities.',
    synonym: 'Agreement, Harmony, Accord',
    difficulty: 'Business'
  },
  {
    word: 'Equanimity',
    phonetic: '/ˌekwəˈnɪməti/',
    partOfSpeech: 'noun',
    definition: 'Mental calmness, composure, and evenness of temper, especially in a difficult situation.',
    example: 'She handled the sudden server outage with inspiring equanimity and poise.',
    synonym: 'Composure, Calmness, Self-possession',
    difficulty: 'Executive'
  },
  {
    word: 'Paradigm',
    phonetic: '/ˈpærədaɪm/',
    partOfSpeech: 'noun',
    definition: 'A typical example or pattern of something; a model or framework.',
    example: 'Serverless computing represented a fundamental paradigm shift for backend architecture.',
    synonym: 'Model, Framework, Benchmark',
    difficulty: 'Advanced'
  }
];

/**
 * Calculates a deterministic daily 10-word set based on the calendar date (YYYY-MM-DD).
 * Ensures every single day brings a fresh, rotating set of 10 words!
 */
export const getDailyWords = (dateString?: string): WordOfDay[] => {
  const dateKey = dateString || new Date().toISOString().split('T')[0];
  
  // Calculate simple hash from date string (e.g. "2026-08-05")
  let hash = 0;
  for (let i = 0; i < dateKey.length; i++) {
    hash = (hash << 5) - hash + dateKey.charCodeAt(i);
    hash |= 0;
  }
  
  const startIndex = Math.abs(hash) % COMPREHENSIVE_WORD_BANK.length;
  const selected: WordOfDay[] = [];
  
  for (let i = 0; i < 10; i++) {
    const wordIdx = (startIndex + i) % COMPREHENSIVE_WORD_BANK.length;
    const baseWord = COMPREHENSIVE_WORD_BANK[wordIdx];
    selected.push({
      ...baseWord,
      id: `w-${dateKey}-${i + 1}`
    });
  }
  
  return selected;
};
