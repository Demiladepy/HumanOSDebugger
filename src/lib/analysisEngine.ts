export interface EmotionalTone {
  person1: string[];
  person2: string[];
  intensity: Record<string, number>;
}

export interface UnmetNeed {
  person: string;
  need: string;
  description: string;
}

export interface EscalationStep {
  trigger: string;
  reaction: string;
  emotional_state: string;
  timestamp?: string;
}

export interface CommunicationDialect {
  person1: {
    style: string;
    traits: string[];
  };
  person2: {
    style: string;
    traits: string[];
  };
}

export interface DialectMismatch {
  conflict_point: string;
  person1_interpretation: string;
  person2_interpretation: string;
  why_it_matters: string;
}

export interface RippleOutcome {
  action: string;
  timeline: string;
  probability: number;
  outcomes: string[];
  trust_impact: number;
  repair_difficulty: 'easy' | 'moderate' | 'hard' | 'critical';
}

export interface RepairStep {
  step: number;
  action: string;
  why: string;
  expected_outcome: string;
}

const COMMUNICATION_STYLES = {
  direct: ['straightforward', 'clear expectations', 'values efficiency', 'explicit needs'],
  indirect: ['subtle hints', 'reads between lines', 'context-dependent', 'avoids confrontation'],
  analytical: ['logical reasoning', 'data-focused', 'problem-solving', 'seeks clarity'],
  emotional: ['feelings-first', 'empathy-driven', 'values connection', 'expressive'],
  avoidant: ['withdraws under stress', 'needs space', 'processes internally', 'dislikes conflict'],
  confrontational: ['addresses issues head-on', 'values honesty', 'direct feedback', 'immediate resolution'],
  reassurance_seeking: ['needs validation', 'checks in frequently', 'values affirmation', 'connection-focused'],
  independence_oriented: ['self-sufficient', 'respects boundaries', 'needs autonomy', 'trusts implicitly']
};

const EMOTIONAL_NEEDS = [
  'validation', 'respect', 'autonomy', 'connection', 'understanding',
  'appreciation', 'trust', 'security', 'recognition', 'space'
];

export function analyzeEmotionalTone(conflictText: string): EmotionalTone {
  const emotions = {
    anger: ['angry', 'frustrated', 'mad', 'irritated', 'furious', 'annoyed'],
    hurt: ['hurt', 'pain', 'disappointed', 'betrayed', 'wounded'],
    fear: ['scared', 'worried', 'anxious', 'afraid', 'nervous'],
    sadness: ['sad', 'depressed', 'down', 'miserable', 'unhappy'],
    confusion: ['confused', 'lost', 'unclear', 'puzzled', 'bewildered'],
    defensiveness: ['defensive', 'attacked', 'accused', 'blamed'],
    dismissiveness: ['whatever', 'fine', 'doesn\'t matter', 'ignored']
  };

  const detectedTones: { person1: string[]; person2: string[]; intensity: Record<string, number> } = {
    person1: [],
    person2: [],
    intensity: {}
  };

  const lowerText = conflictText.toLowerCase();

  Object.entries(emotions).forEach(([emotion, keywords]) => {
    const count = keywords.filter(kw => lowerText.includes(kw)).length;
    if (count > 0) {
      detectedTones.person1.push(emotion);
      detectedTones.intensity[emotion] = Math.min(count * 25, 100);
    }
  });

  return detectedTones;
}

export function identifyUnmetNeeds(conflictText: string, emotionalTone: EmotionalTone): UnmetNeed[] {
  const needs: UnmetNeed[] = [];
  const lowerText = conflictText.toLowerCase();

  const needPatterns = {
    validation: ['listen', 'hear me', 'understand', 'ignored', 'dismissed'],
    respect: ['disrespect', 'talked down', 'condescending', 'belittled'],
    autonomy: ['controlling', 'micromanage', 'trust me', 'my decision'],
    connection: ['distant', 'alone', 'disconnect', 'together', 'us'],
    understanding: ['don\'t get it', 'misunderstand', 'see my side'],
    appreciation: ['taken for granted', 'appreciate', 'acknowledge', 'thank'],
    trust: ['trust', 'doubt', 'believe', 'suspicious'],
    security: ['safe', 'secure', 'stable', 'uncertain'],
    space: ['space', 'overwhelm', 'smother', 'breathing room']
  };

  Object.entries(needPatterns).forEach(([need, keywords]) => {
    const matched = keywords.some(kw => lowerText.includes(kw));
    if (matched) {
      needs.push({
        person: 'Person A',
        need: need,
        description: `Seeking ${need} that isn't being met in the interaction`
      });
    }
  });

  return needs;
}

export function extractEscalationChain(conflictText: string): EscalationStep[] {
  const chain: EscalationStep[] = [];
  const sentences = conflictText.split(/[.!?]+/).filter(s => s.trim().length > 0);

  let previousState = 'calm';

  sentences.forEach((sentence, idx) => {
    const lower = sentence.toLowerCase();
    let state = previousState;
    let trigger = '';
    let reaction = '';

    if (lower.includes('but') || lower.includes('however')) {
      state = 'defensive';
      trigger = 'Perceived contradiction or dismissal';
      reaction = 'Defensive response';
    } else if (lower.includes('always') || lower.includes('never')) {
      state = 'escalating';
      trigger = 'Absolute language used';
      reaction = 'Generalization increases tension';
    } else if (idx > 0 && (lower.includes('fine') || lower.includes('whatever'))) {
      state = 'shutdown';
      trigger = 'Dismissive language';
      reaction = 'Emotional withdrawal';
    }

    if (state !== previousState || idx === 0) {
      chain.push({
        trigger: trigger || 'Initial statement',
        reaction: reaction || sentence.trim().substring(0, 100),
        emotional_state: state
      });
    }

    previousState = state;
  });

  return chain;
}

export function detectCommunicationDialects(conflictText: string): CommunicationDialect {
  const lowerText = conflictText.toLowerCase();

  let person1Style = 'direct';
  let person2Style = 'indirect';

  if (lowerText.includes('feel') || lowerText.includes('hurt') || lowerText.includes('love')) {
    person1Style = 'emotional';
  } else if (lowerText.includes('think') || lowerText.includes('logically') || lowerText.includes('reason')) {
    person1Style = 'analytical';
  }

  if (lowerText.includes('space') || lowerText.includes('alone') || lowerText.includes('withdraw')) {
    person2Style = 'avoidant';
  } else if (lowerText.includes('talk about this') || lowerText.includes('address') || lowerText.includes('discuss')) {
    person2Style = 'confrontational';
  }

  return {
    person1: {
      style: person1Style,
      traits: COMMUNICATION_STYLES[person1Style as keyof typeof COMMUNICATION_STYLES]
    },
    person2: {
      style: person2Style,
      traits: COMMUNICATION_STYLES[person2Style as keyof typeof COMMUNICATION_STYLES]
    }
  };
}

export function analyzeDialectMismatch(dialects: CommunicationDialect): DialectMismatch[] {
  const mismatches: DialectMismatch[] = [];

  const incompatiblePairs: Record<string, { conflict: string; p1_interp: string; p2_interp: string; why: string }> = {
    'direct-indirect': {
      conflict: 'Directness vs. Subtlety',
      p1_interp: 'Being clear and honest',
      p2_interp: 'Being blunt and harsh',
      why: 'Direct communication feels aggressive to indirect communicators'
    },
    'emotional-analytical': {
      conflict: 'Feelings vs. Logic',
      p1_interp: 'Sharing emotions to connect',
      p2_interp: 'Being overly emotional and irrational',
      why: 'Analytical thinkers may dismiss emotional expressions as illogical'
    },
    'confrontational-avoidant': {
      conflict: 'Addressing vs. Avoiding',
      p1_interp: 'Healthy conflict resolution',
      p2_interp: 'Forced confrontation and pressure',
      why: 'Avoidant people need space while confrontational people need immediate resolution'
    },
    'reassurance_seeking-independence_oriented': {
      conflict: 'Connection vs. Space',
      p1_interp: 'Seeking reassurance and connection',
      p2_interp: 'Clingy and insecure behavior',
      why: 'Different needs for emotional check-ins create friction'
    }
  };

  const key1 = `${dialects.person1.style}-${dialects.person2.style}`;
  const key2 = `${dialects.person2.style}-${dialects.person1.style}`;

  if (incompatiblePairs[key1]) {
    const mismatch = incompatiblePairs[key1];
    mismatches.push({
      conflict_point: mismatch.conflict,
      person1_interpretation: mismatch.p1_interp,
      person2_interpretation: mismatch.p2_interp,
      why_it_matters: mismatch.why
    });
  } else if (incompatiblePairs[key2]) {
    const mismatch = incompatiblePairs[key2];
    mismatches.push({
      conflict_point: mismatch.conflict,
      person1_interpretation: mismatch.p2_interp,
      person2_interpretation: mismatch.p1_interp,
      why_it_matters: mismatch.why
    });
  }

  return mismatches;
}

export function simulateRippleEffects(
  conflictText: string,
  scenarioAction: string
): RippleOutcome {
  const scenarios: Record<string, Partial<RippleOutcome>> = {
    ignore: {
      timeline: '3-7 days',
      probability: 75,
      outcomes: [
        'Resentment builds silently',
        'Distance increases',
        'Future conflicts become more intense',
        'Trust erodes gradually'
      ],
      trust_impact: -30,
      repair_difficulty: 'hard'
    },
    defensive: {
      timeline: '1-2 days',
      probability: 85,
      outcomes: [
        'Immediate escalation',
        'Original issue gets buried',
        'New conflicts emerge',
        'Emotional damage deepens'
      ],
      trust_impact: -45,
      repair_difficulty: 'critical'
    },
    apologize: {
      timeline: 'Immediate',
      probability: 65,
      outcomes: [
        'De-escalation possible',
        'Opens dialogue',
        'Shows accountability',
        'Relationship can stabilize'
      ],
      trust_impact: 20,
      repair_difficulty: 'moderate'
    },
    listen: {
      timeline: 'Immediate',
      probability: 80,
      outcomes: [
        'Other person feels heard',
        'Root cause emerges',
        'Connection re-established',
        'Foundation for repair'
      ],
      trust_impact: 35,
      repair_difficulty: 'easy'
    }
  };

  const actionKey = scenarioAction.toLowerCase().includes('ignore') ? 'ignore' :
                    scenarioAction.toLowerCase().includes('defend') ? 'defensive' :
                    scenarioAction.toLowerCase().includes('apologize') ? 'apologize' : 'listen';

  return {
    action: scenarioAction,
    ...(scenarios[actionKey] as RippleOutcome)
  };
}

export function generateRepairPlaybook(
  emotionalTone: EmotionalTone,
  unmetNeeds: UnmetNeed[],
  dialectMismatch: DialectMismatch[]
): RepairStep[] {
  const steps: RepairStep[] = [];

  steps.push({
    step: 1,
    action: 'Acknowledge the hurt',
    why: 'Validation is the foundation of repair',
    expected_outcome: 'Defensiveness decreases, openness increases'
  });

  if (unmetNeeds.length > 0) {
    steps.push({
      step: 2,
      action: `Address the unmet need: ${unmetNeeds[0].need}`,
      why: `This is driving the conflict beneath the surface`,
      expected_outcome: 'Core issue is exposed and addressable'
    });
  }

  if (dialectMismatch.length > 0) {
    steps.push({
      step: 3,
      action: 'Explain your communication style difference',
      why: 'Many conflicts are style mismatches, not actual disagreements',
      expected_outcome: 'Reduces misinterpretation and blame'
    });
  }

  steps.push({
    step: steps.length + 1,
    action: 'Ask what they need from you',
    why: 'Gives them agency and shows genuine care',
    expected_outcome: 'Creates collaborative repair process'
  });

  steps.push({
    step: steps.length + 1,
    action: 'Propose a specific behavior change',
    why: 'Abstract apologies don\'t rebuild trust, actions do',
    expected_outcome: 'Concrete path forward established'
  });

  return steps;
}

export function analyzeConflict(
  conflictText: string,
  relationshipType: 'friendship' | 'co-founder' | 'romantic' | 'family'
) {
  const emotionalTone = analyzeEmotionalTone(conflictText);
  const unmetNeeds = identifyUnmetNeeds(conflictText, emotionalTone);
  const escalationChain = extractEscalationChain(conflictText);
  const communicationDialects = detectCommunicationDialects(conflictText);
  const dialectMismatch = analyzeDialectMismatch(communicationDialects);
  const repairPlaybook = generateRepairPlaybook(emotionalTone, unmetNeeds, dialectMismatch);

  const misunderstandingRoot = dialectMismatch.length > 0
    ? dialectMismatch[0].why_it_matters
    : 'Communication breakdown due to unmatched expectations';

  return {
    emotionalTone,
    unmetNeeds,
    misunderstandingRoot,
    escalationChain,
    communicationDialects,
    dialectMismatch,
    repairPlaybook
  };
}
