import type { CognitiveQuestion } from '../types';

export const COGNITIVE_QUESTIONS: CognitiveQuestion[] = [
  // 1. Logical Reasoning (Adaptive)
  {
    id: 'cog-log-1',
    modeType: 'logical',
    modeCategory: 'Logical & Aptitude',
    title: 'Adaptive Series & Pattern Deduction',
    question: 'Find the next number in the series: 3, 7, 15, 31, 63, ? Explain the mathematical logic behind your answer.',
    level: 'Level 2: Intermediate',
    stepByStepSolution: 'STEP 1: Calculate differences between consecutive terms: 7 - 3 = 4, 15 - 7 = 8, 31 - 15 = 16, 63 - 31 = 32.\nSTEP 2: Observe pattern in differences: 4, 8, 16, 32 (each difference doubles).\nSTEP 3: Next difference is 32 × 2 = 64.\nSTEP 4: Next term in series = 63 + 64 = 127.\nALTERNATIVE LOGIC: Each term is n_k = 2 × n_{k-1} + 1. Thus 2(63) + 1 = 127.',
    keyEvaluationCriteria: [
      'Identification of doubling differences or 2n+1 recursive formula',
      'Step-by-step arithmetic verification',
      'Clear verbal articulation of mathematical induction'
    ]
  },
  {
    id: 'cog-log-2',
    modeType: 'logical',
    modeCategory: 'Logical & Aptitude',
    title: 'Syllogism & Deductive Proof',
    question: 'Premise 1: All high-performance algorithms are O(log n). Premise 2: Some cache indexing systems are high-performance algorithms. What valid conclusions can be drawn?',
    level: 'Level 3: Advanced',
    stepByStepSolution: 'STEP 1: Analyze universal affirmative Premise 1 (All A are B).\nSTEP 2: Analyze particular affirmative Premise 2 (Some C are A).\nSTEP 3: Deduce intersection: Since some C are A, and all A are B, it logically follows that "Some cache indexing systems are O(log n)".\nSTEP 4: Fallacy check: We cannot conclude that ALL cache indexing systems are O(log n) or that all O(log n) systems are cache indexing systems.',
    keyEvaluationCriteria: [
      'Valid categorical syllogism deduction',
      'Avoidance of existential fallacies',
      'Clear distinction between necessary vs possible conclusions'
    ]
  },

  // 2. Critical Thinking
  {
    id: 'cog-crit-1',
    modeType: 'critical',
    modeCategory: 'Debate & Verbal',
    title: 'Workplace Innovation Policy',
    question: 'Should modern technology companies adopt a mandatory 4-day work week? Evaluate the productivity, employee burnout, and economic tradeoffs.',
    level: 'Level 3: Advanced',
    stepByStepSolution: 'ARGUMENT FOR: 100-80-100 rule (100% pay, 80% time, 100% output). Reduces cognitive fatigue and burnout.\nARGUMENT AGAINST: Shift work, emergency customer support (24/7 SLAs), and industries with linear time-output constraints (manufacturing, healthcare) face operational bottlenecks.\nBALANCED CONCLUSION: Hybrid phased rollout with asynchronous communication workflows is superior to blanket mandates.',
    keyEvaluationCriteria: [
      'Structure of premise and evidence',
      'Anticipation of operational counterarguments',
      'Precision of economic vocabulary'
    ]
  },
  {
    id: 'cog-crit-2',
    modeType: 'critical',
    modeCategory: 'Debate & Verbal',
    title: 'AI Impact on Engineering',
    question: 'Will Generative AI fully replace human software engineers within the next decade, or will it redefine engineering roles? Defend your position with evidence.',
    level: 'Level 4: Lead',
    stepByStepSolution: 'CORE THESIS: AI automates boilerplate code generation and syntax synthesis, but shifts human engineering up the stack toward system architecture, edge-case security, requirement disambiguation, and domain alignment.\nEVIDENCE: High-level language evolution (Assembly → C → Python) increased engineer leverage rather than reducing overall developer headcount.',
    keyEvaluationCriteria: [
      'Clarity of core thesis',
      'Historical technology adoption precedents cited',
      'Vocal confidence and persuasive delivery'
    ]
  },

  // 3. Case Studies
  {
    id: 'cog-case-1',
    modeType: 'case_study',
    modeCategory: 'Tech & Product Strategy',
    title: 'Production Incident Diagnosis',
    question: 'A major enterprise customer reports that their web dashboard crashes immediately after updating to version 4.2. How would you investigate and resolve this issue step by step?',
    level: 'Level 3: Advanced',
    stepByStepSolution: 'PHASE 1 (Triage & Isolation): Check error logs, stack traces, and rollback options immediately to mitigate uptime impact.\nPHASE 2 (Root Cause): Replicate in staging environment, inspect v4.2 database migration scripts & API payload backward compatibility.\nPHASE 3 (Remediation): Deploy hotfix patch or enable feature flag rollback.\nPHASE 4 (Post-Mortem): Implement regression integration tests and blameless post-mortem analysis.',
    keyEvaluationCriteria: [
      'Systematic triage prioritization (mitigation before deep fix)',
      'Clear technical diagnostic chain',
      'Stakeholder communication strategy'
    ]
  },

  // 4. Aptitude + Verbal Combined
  {
    id: 'cog-apt-1',
    modeType: 'aptitude_verbal',
    modeCategory: 'Logical & Aptitude',
    title: 'Server Performance & Latency Analytics',
    question: 'Examine the server analytics chart displayed. 1) What trend do you observe between CPU load and API latency? 2) What conclusion can you draw regarding system scalability? 3) What architecture recommendation would you make?',
    chartData: {
      title: 'Quarterly Peak Load vs API Response Latency',
      subtitle: 'Measured in milliseconds across 5 cluster nodes',
      labels: ['10k Users', '25k Users', '50k Users', '75k Users', '100k Users'],
      datasets: [
        {
          label: 'API Latency (ms)',
          data: [45, 60, 110, 480, 1450],
          color: '#06b6d4'
        },
        {
          label: 'CPU Load (%)',
          data: [22, 38, 55, 89, 99],
          color: '#f59e0b'
        }
      ],
      chartType: 'bar'
    },
    level: 'Level 4: Lead',
    stepByStepSolution: '1. TREND: Latency remains linear up to 50k users (110ms), but experiences exponential degradation beyond 75k users (1450ms) as CPU load hits 89%-99%.\n2. CONCLUSION: The architecture hits a severe concurrency bottleneck when CPU load exceeds 85%, indicating unoptimized synchronous DB queries or single-threaded event loops.\n3. RECOMMENDATION: Implement horizonal auto-scaling, Redis query caching, and async job queues for heavy background tasks.',
    keyEvaluationCriteria: [
      'Accurate verbal extraction of non-linear data points',
      'Identification of exponential bottleneck threshold',
      'Concrete architectural remediation proposal'
    ]
  },

  // 5. "Think Aloud" Mode
  {
    id: 'cog-think-1',
    modeType: 'think_aloud',
    modeCategory: 'Debate & Verbal',
    title: 'Architectural Logic & Geometry',
    question: 'Why are manhole covers round instead of square or rectangular? Walk me through your logical reasoning out loud as you analyze the problem.',
    level: 'Level 2: Intermediate',
    stepByStepSolution: 'REASON 1 (Geometric Safety): A round cover cannot fall through its own opening because a circle has a constant diameter in all directions. A square cover inserted diagonally could drop straight down into the hole.\nREASON 2 (Ergonomics & Transport): Heavy metal round covers can easily be rolled on edge by one person.\nREASON 3 (Structural Integrity): Circular shapes distribute subterranean soil pressure evenly without weak corner stress points.\nREASON 4 (Ease of Alignment): Round covers do not need precise rotational alignment to fit.',
    keyEvaluationCriteria: [
      'Immediate identification of geometric constant diameter property',
      'Systematic structure of mechanical, safety, and operational reasons',
      'Fluid think-aloud verbal delivery'
    ]
  },

  // 6. AI Debate
  {
    id: 'cog-deb-1',
    modeType: 'ai_debate',
    modeCategory: 'Debate & Verbal',
    title: 'Remote Work vs Office Productivity',
    question: 'Opening Prompt: "Remote work is inherently more productive and superior to office co-location for engineering teams." State your position, and prepare for the AI to counter-challenge your arguments.',
    level: 'Level 3: Advanced',
    stepByStepSolution: 'STRATEGY: Define productivity clearly (focused deep-work hours vs collaborative innovation speed). Acknowledge valid office benefits (serendipitous discovery, rapid onboarding) before defending async deep-work workflows.',
    keyEvaluationCriteria: [
      'Poise under direct AI counter-questioning',
      'Refutation of opposing arguments without logical fallacies',
      'Use of executive vocabulary and structured transitions'
    ]
  },

  // 7. Estimation (Fermi Questions)
  {
    id: 'cog-fermi-1',
    modeType: 'fermi_estimation',
    modeCategory: 'Debate & Verbal',
    title: 'Market Sizing & Quantitative Estimation',
    question: 'Estimate the total number of commercial coffee shops operating in Mumbai today. Explain all your baseline assumptions and calculation steps aloud.',
    level: 'Level 4: Lead',
    stepByStepSolution: 'STEP 1 (Population Baseline): Mumbai population ≈ 21 million.\nSTEP 2 (Target Demographic): Target coffee drinkers = Middle/upper class (30%) = 6.3 million people.\nSTEP 3 (Consumption Frequency): 6.3M people drink coffee 3x/week = ~19M cups per week = 2.7M cups per day.\nSTEP 4 (Shop Capacity): Average coffee shop sells 300 cups/day.\nSTEP 5 (Final Estimate): 2.7M / 300 = ~9,000 coffee outlets (including formal cafes, kiosks, and commercial tea/coffee stalls).',
    keyEvaluationCriteria: [
      'Clear explicit articulation of baseline assumptions',
      'Methodical top-down or bottom-up calculation steps',
      'Sanity check of final numerical order of magnitude'
    ]
  },

  // 8. Product Sense
  {
    id: 'cog-prod-1',
    modeType: 'product_sense',
    modeCategory: 'Tech & Product Strategy',
    title: 'Inclusive Digital Product Design',
    question: 'Design a mobile health and daily assistant app specifically tailored for senior citizens (ages 70+). Walk through user pain points, key features, and UX accessibility choices.',
    level: 'Level 3: Advanced',
    stepByStepSolution: 'USER EMPATHY: Reduced visual acuity, tremors, cognitive overload, anxiety over complex UI.\nFEATURE 1: Voice-first natural interaction ("Remind me to take my heart pill at 8 PM").\nFEATURE 2: Ultra-high contrast UI with 24pt minimum tap targets.\nFEATURE 3: One-touch emergency caregiver sync with automatic fall detection.',
    keyEvaluationCriteria: [
      'Deep user empathy and persona identification',
      'Prioritization of core features over feature bloat',
      'Accessibility & UX design justification'
    ]
  },

  // 9. Systems Thinking
  {
    id: 'cog-sys-1',
    modeType: 'systems_thinking',
    modeCategory: 'Tech & Product Strategy',
    title: 'System Optimization & Bottlenecks',
    question: 'Why do phantom traffic jams occur on high-speed highways even when there are no accidents or construction bottlenecks? Analyze the feedback loops and system dynamics.',
    level: 'Level 4: Lead',
    stepByStepSolution: 'SYSTEM MECHANISM (Phantom Bottleneck / Shockwave): A single driver taps brakes slightly → driver behind reacts with greater deceleration → braking wave amplifies backward along the vehicle line.\nFEEDBACK LOOP: Driver reaction delays + close tailgating amplify small disturbances into standing traffic waves.\nSYSTEM SOLUTIONS: Adaptive cruise control, variable speed limits, automated lane merging.',
    keyEvaluationCriteria: [
      'Identification of non-linear shockwave propagation',
      'Analysis of human reaction lag feedback loops',
      'Systemic architectural intervention proposals'
    ]
  },

  // 10. Interview Decision Scenarios
  {
    id: 'cog-eth-1',
    modeType: 'ethical_decisions',
    modeCategory: 'Leadership & Judgment',
    title: 'Engineering Ethics & License Compliance',
    question: 'You discover that a senior teammate copied proprietary code from an open-source GPL-licensed repository into your commercial closed-source production codebase two days before launch. What do you do?',
    level: 'Level 5: Executive',
    stepByStepSolution: 'STEP 1 (Immediate Risk Assessment): Inform legal and engineering leadership immediately regarding GPL copyleft contamination risks.\nSTEP 2 (Technical Remediation): Quarantine the affected module, isolate the GPL code, and rewrite the component using clean-room engineering principles.\nSTEP 3 (Process Guardrails): Implement automated SAST/DAST license compliance scanners (Snyk, FOSSID) in the CI/CD deployment pipeline.\nSTEP 4 (Team Communication): Conduct private constructive feedback with teammate on legal liability.',
    keyEvaluationCriteria: [
      'Uncompromising professional ethics and legal compliance',
      'Pragmatic technical remediation plan',
      'Constructive peer leadership and CI/CD process prevention'
    ]
  }
];
