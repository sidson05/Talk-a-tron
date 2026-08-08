import type { StoryPrompt, InterviewQuestion, WordOfDay } from '../types';

export const STORY_PROMPTS: StoryPrompt[] = [
  {
    id: 'story-1',
    title: 'The AI Pivot at Apex Tech',
    category: 'Business & Tech',
    difficulty: 'Intermediate',
    text: 'When Apex Technologies faced declining revenues from traditional software sales, CEO Maya Lin decided to pivot the entire company toward generative AI assistants. The transition required retraining 400 engineers in machine learning within three months. Despite fierce resistance from traditional project managers, Maya launched a peer-mentoring program and incentivized rapid experimentation. Within a year, Apex launched three flagship AI products that accounted for 60% of annual revenue.',
    speakingTask: 'Summarize Maya Lin\'s leadership strategy in your own words and explain how you would handle team resistance during a major company transition.'
  },
  {
    id: 'story-2',
    title: 'Overcoming the Server Outage',
    category: 'Business & Tech',
    difficulty: 'Advanced',
    text: 'On Black Friday, CloudNet experienced a critical database deadlock that brought down 1,200 ecommerce websites. Lead engineer David Chen took charge during the crisis. Rather than panicking, he set up a synchronized war room, isolated the bottleneck query in the primary database replica, and safely executed a zero-downtime failover to the secondary cluster within 18 minutes.',
    speakingTask: 'Describe how David managed high-pressure technical troubleshooting and why clear communication is essential during operational emergencies.'
  },
  {
    id: 'story-3',
    title: 'The Art of Persuasive Negotiation',
    category: 'Leadership',
    difficulty: 'Advanced',
    text: 'Negotiating a multi-million dollar merger requires active listening rather than aggressive persuasion. Senior partner Elena Vance always begins high-stakes discussions by asking open-ended questions to uncover the opposing party\'s underlying motivations. By identifying shared long-term objectives before debating contract terms, she builds genuine trust and reaches mutually beneficial agreements.',
    speakingTask: 'Retell this story highlighting Elena\'s core negotiation principles, and explain why active listening is often superior to aggressive debate.'
  },
  {
    id: 'story-4',
    title: 'A Remote Team\'s Breakthrough',
    category: 'Daily Life',
    difficulty: 'Beginner',
    text: 'Working across five different time zones, the design team at Canvas Studio struggled to stay aligned on product launches. Designer Alex proposed replacing lengthy synchronous meetings with concise 2-minute video updates and collaborative Figma whiteboards. This simple workflow shift cut meeting time by 50% and boosted team satisfaction score by 35%.',
    speakingTask: 'Explain the problem Alex\'s team faced and how async communication improved their team productivity.'
  },
  {
    id: 'story-5',
    title: 'The Unforeseen Product Discovery',
    category: 'Creative',
    difficulty: 'Intermediate',
    text: 'While testing a new data pipeline for anomaly detection, research engineer Sarah noticed an unexpected spike in user engagement during midnight hours. Investigating further, she realized users were using their analytics tool to build personal productivity trackers. Recognizing the unfulfilled market demand, Sarah pitched a new consumer feature that quickly became their most viral product tier.',
    speakingTask: 'Retell the story of Sarah\'s discovery and share your thoughts on how unexpected user feedback can spark innovation.'
  },
  {
    id: 'story-6',
    title: 'Resilience in Product Launch',
    category: 'Philosophy',
    difficulty: 'Advanced',
    text: 'True resilience is not avoiding mistakes, but pivoting swiftly when initial hypotheses fail. When a new mobile app launch missed user adoption targets by 40%, the growth team conducted 50 customer interviews in five days. By leaning into honest user critique, they simplified the onboarding flow and tripled user retention in the following quarter.',
    speakingTask: 'Reflect on the key lessons of resilience described in the story and talk about how failure can serve as a catalyst for growth.'
  }
];

export const INTERVIEW_QUESTIONS: InterviewQuestion[] = [
  {
    id: 'int-1',
    role: 'Software Engineering',
    category: 'Problem Solving',
    question: 'Describe a time when you had to debug a severe production issue under tight time constraints.',
    starTips: {
      situation: 'Set the scene: Describe the system, severity, and urgency of the outage.',
      task: 'Clarify your responsibility: What was your specific goal during the crisis?',
      action: 'Detail your steps: Diagnostics, root-cause identification, communication, and fix execution.',
      result: 'Quantify the outcome: Resolution time, system recovery, and preventive measures implemented.'
    },
    modelAnswer: 'SITUATION: During a Black Friday traffic surge, our primary database CPU hit 99% utilization, slowing response times for 50,000 active users.\nTASK: As lead engineer on duty, I needed to restore database health immediately without causing data corruption or extended downtime.\nACTION: I opened a synchronized war room, isolated an unindexed SQL query in the order processing pipeline, deployed a zero-downtime hotfix index, and enabled query caching.\nRESULT: Query execution latency dropped from 4.2 seconds to 15 milliseconds, CPU utilization stabilized at 35%, and we maintained 100% system availability with zero lost transactions.'
  },
  {
    id: 'int-2',
    role: 'Product Management',
    category: 'Conflict Resolution',
    question: 'Tell me about a situation where engineering and business stakeholders disagreed on product priorities.',
    starTips: {
      situation: 'Explain the conflicting goals between teams and business context.',
      task: 'Define your role in mediating the impasse.',
      action: 'Explain how you gathered data, conducted tradeoffs analysis, and led consensus building.',
      result: 'Highlight the agreed roadmap delivery, team morale, and business impact.'
    },
    modelAnswer: 'SITUATION: Engineering wanted to dedicate an entire sprint to technical debt refactoring, while executive leadership demanded launching three new monetization features for Q3.\nTASK: As Product Manager, I had to align both groups around a sustainable roadmap without burning out engineers or missing revenue milestones.\nACTION: I organized a structured tradeoff workshop. I quantified the business cost of technical debt (12% increase in crash rate) alongside revenue estimates for new features, then proposed a hybrid 70/30 allocation sprint model.\nRESULT: Both teams unanimously approved the compromise. We successfully released two high-priority features while reducing platform crashes by 40% and increasing team velocity by 18%.'
  },
  {
    id: 'int-3',
    role: 'Leadership',
    category: 'Leadership',
    question: 'Give an example of how you motivated an underperforming team or team member to achieve a major goal.',
    starTips: {
      situation: 'Provide context on the performance gap and team dynamics.',
      task: 'Identify what you set out to change or coach.',
      action: 'Describe 1-on-1 coaching, goal resetting, feedback loops, and empowerment strategies.',
      result: 'Share performance metric improvements and long-term team confidence.'
    },
    modelAnswer: 'SITUATION: A senior developer on my team was missing sprint commitments and showing signs of disengagement after a project restructuring.\nTASK: As engineering manager, my goal was to understand the root cause, rebuild his confidence, and raise his delivery speed back to senior benchmarks.\nACTION: I scheduled weekly 1-on-1 coaching sessions. I discovered he felt unaligned with the new project architecture. I assigned him ownership of the core system redesign and paired him with an expert mentor.\nRESULT: Within six weeks, his ticket velocity increased by 65%, he successfully delivered the architecture upgrade ahead of schedule, and he was subsequently promoted to technical lead.'
  },
  {
    id: 'int-4',
    role: 'General',
    category: 'Failure & Learning',
    question: 'Describe a project that failed or did not go according to plan. What did you learn and how did you adapt?',
    starTips: {
      situation: 'Be transparent about the project scope and original expectations.',
      task: 'What went wrong and what accountability did you assume?',
      action: 'Detail how you conducted post-mortem analysis and pivoted process.',
      result: 'Describe subsequent project successes using lessons learned.'
    },
    modelAnswer: 'SITUATION: We spent four months developing an automated analytics reporting feature, but post-launch adoption was under 5% among target users.\nTASK: As project lead, I assumed full accountability for the mismatch and set out to determine why our user adoption hypothesis failed.\nACTION: I led a comprehensive blameless post-mortem. We conducted 25 direct customer discovery calls and realized users found the dashboard interface overly complex compared to simple CSV exports. We simplified the UX to 1-click reports.\nRESULT: The redesigned 1-click reporting tool achieved an 82% adoption rate within two months. I instituted mandatory customer validation interviews before writing code for all future initiatives.'
  },
  {
    id: 'int-5',
    role: 'Data Science',
    category: 'Prioritization',
    question: 'How do you handle a scenario where business leaders expect immediate results from a complex ML model?',
    starTips: {
      situation: 'Explain the business timeline vs modeling complexity tradeoff.',
      task: 'Your goal to manage expectations while delivering incremental value.',
      action: 'How you built baseline heuristic models first before iterative complex modeling.',
      result: 'Show fast feedback loops and stakeholder trust gained.'
    },
    modelAnswer: 'SITUATION: Business stakeholders requested a deep learning customer churn prediction model with a strict 2-week deadline for Q4 planning.\nTASK: I needed to deliver immediate predictive insights to leadership while setting realistic expectations for deep neural network training timelines.\nACTION: I proposed an iterative staged deployment. In Week 1, I built a fast baseline Logistic Regression & XGBoost model that captured 75% of churn signals immediately. In parallel, I scheduled deep model iterations for Month 2.\nRESULT: Executive leadership used the Week 1 baseline model to launch targeted retention campaigns that saved $140,000 in immediate churned revenue, gaining time to refine the complex model.'
  },
  {
    id: 'int-6',
    role: 'Customer Success',
    category: 'Conflict Resolution',
    question: 'Tell me about a time you turned around an unhappy enterprise client on the verge of churning.',
    starTips: {
      situation: 'Describe the client customer profile and source of dissatisfaction.',
      task: 'Your objective to retain account trust.',
      action: 'Root cause analysis, empathy listening, tailored action plan execution.',
      result: 'Client retention percentage, contract renewal, or testimonial.'
    },
    modelAnswer: 'SITUATION: Our largest enterprise account ($250k ARR) issued a formal intent to churn due to recurring onboarding delays and missing integrations.\nTASK: As Lead Customer Success Manager, I was tasked with restoring client trust and securing their upcoming annual contract renewal.\nACTION: I flew to the client headquarters for an in-person executive alignment session. I acknowledged our service gaps, established a dedicated Slack channel with engineering, and delivered weekly progress milestones.\nRESULT: We resolved all 4 critical technical blockers 10 days ahead of deadline. The client signed a 2-year contract expansion worth $400k ARR and agreed to serve as a public customer reference.'
  }
];

export const DAILY_VOCABULARY: WordOfDay[] = [
  {
    id: 'v1',
    word: 'Articulate',
    phonetic: '/ɑːrˈtɪkjuleɪt/',
    partOfSpeech: 'adjective / verb',
    definition: 'Expressing thoughts or feelings fluently and coherently; or to present an idea clearly.',
    example: 'She was able to articulate the complex architectural roadmap to non-technical stakeholders with exceptional clarity.',
    synonym: 'Eloquent, Coherent, Expressive',
    difficulty: 'Executive',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/articulate-us.mp3'
  },
  {
    id: 'v2',
    word: 'Pragmatic',
    phonetic: '/præɡˈmætɪk/',
    partOfSpeech: 'adjective',
    definition: 'Dealing with things sensibly and realistically based on practical considerations rather than theoretical ones.',
    example: 'The team took a pragmatic approach by launching an MVP before investing in full automation.',
    synonym: 'Practical, Sensible, Down-to-earth',
    difficulty: 'Advanced',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/pragmatic-us.mp3'
  },
  {
    id: 'v3',
    word: 'Ubiquitous',
    phonetic: '/juːˈbɪkwɪtəs/',
    partOfSpeech: 'adjective',
    definition: 'Present, appearing, or found everywhere simultaneously.',
    example: 'Cloud computing has become ubiquitous across modern technology companies worldwide.',
    synonym: 'Omnipresent, Pervasive, Universal',
    difficulty: 'Executive',
    audioUrl: 'https://api.dictionaryapi.dev/media/pronunciations/en/ubiquitous-us.mp3'
  }
];
