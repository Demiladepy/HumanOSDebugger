export interface EmotionalTimelinePoint {
  msg: number;
  intensity: number;
  emotion: string;
}

export interface EmotionalDiff {
  trust: number;
  safety: number;
  clarity: number;
  intention: number;
}

export interface PerspectiveResult {
  sender_intent: string;
  receiver_interpretation: string;
}

export interface CompatibilityItem {
  category: string;
  status: "Aligned" | "Potential Friction" | "High Friction";
  explanation: string;
}

export interface CrisisSimulation {
  trust_change: number;
  safety_change: number;
  risk_of_escalation: number;
  overall_success_probability: number;
  timeline: string;
}

export interface RepairPlaybook {
  sample_messages: string[];
  avoid: string[];
  timing: string;
  expected_response: string;
}

export interface ConflictType {
  type: string;
  description: string;
  repair_strategy: string;
}

export interface MicroEmotion {
  msgIndex: number;
  emotions: string[];
  intensity: number;
}

export interface AttachmentProfile {
  personA: string;
  personB: string;
  recommendations: string[];
}

export interface RootCauseNode {
  root: string;
  branches: { node: string }[];
}

export async function getEmotionalTimeline(conversation: string): Promise<EmotionalTimelinePoint[]> {
  const messages = conversation.split('\n').filter(m => m.trim());
  const emotions = ['anger', 'hurt', 'anxiety', 'defensiveness', 'sadness', 'frustration'];

  return messages.map((msg, idx) => {
    const emotionScore = Math.random();
    const selectedEmotion = emotions[Math.floor(emotionScore * emotions.length)];
    const intensity = 0.3 + (Math.random() * 0.7);

    return {
      msg: idx + 1,
      intensity: parseFloat(intensity.toFixed(2)),
      emotion: selectedEmotion
    };
  });
}

export async function getEmotionalDiff(conversation: string): Promise<EmotionalDiff> {
  const hasApology = conversation.toLowerCase().includes('sorry') || conversation.toLowerCase().includes('apologize');
  const hasAccusation = conversation.toLowerCase().includes('always') || conversation.toLowerCase().includes('never');
  const hasValidation = conversation.toLowerCase().includes('understand') || conversation.toLowerCase().includes('hear you');

  return {
    trust: hasApology ? 0.15 : hasAccusation ? -0.25 : -0.05,
    safety: hasValidation ? 0.20 : hasAccusation ? -0.18 : -0.08,
    clarity: hasValidation || hasApology ? 0.28 : -0.12,
    intention: hasApology ? 0.22 : hasAccusation ? -0.30 : 0.05
  };
}

export async function getPerspectiveSwap(message: string, mode: 'youToThem' | 'themToYou'): Promise<PerspectiveResult> {
  const isApology = message.toLowerCase().includes('sorry');
  const isDefensive = message.toLowerCase().includes('but') || message.toLowerCase().includes('however');

  if (mode === 'youToThem') {
    return {
      sender_intent: isApology
        ? "I want to acknowledge the hurt I caused and repair our relationship."
        : isDefensive
        ? "I need to explain my side and defend my actions."
        : "I want to communicate my feelings and be heard.",
      receiver_interpretation: isApology
        ? "They're taking responsibility, which feels genuine."
        : isDefensive
        ? "They're making excuses instead of listening to me."
        : "They seem frustrated and want to be understood."
    };
  } else {
    return {
      sender_intent: "I'm expressing my hurt and need for acknowledgment.",
      receiver_interpretation: isDefensive
        ? "They're attacking me and not seeing my side."
        : "They need reassurance and validation from me."
    };
  }
}

export async function getCompatibilityMatrix(conversation: string): Promise<CompatibilityItem[]> {
  const hasDirectCommunication = conversation.includes('I feel') || conversation.includes('I need');
  const hasIndirectHints = conversation.includes('maybe') || conversation.includes('I guess');
  const hasEmotionalLanguage = conversation.toLowerCase().includes('hurt') || conversation.toLowerCase().includes('sad');
  const hasLogicalLanguage = conversation.toLowerCase().includes('think') || conversation.toLowerCase().includes('logically');

  return [
    {
      category: "Directness",
      status: hasDirectCommunication && hasIndirectHints ? "Potential Friction" : hasDirectCommunication ? "Aligned" : "High Friction",
      explanation: hasDirectCommunication
        ? "One person communicates directly while the other uses hints, leading to misunderstandings."
        : "Both avoid direct communication, causing issues to remain unresolved."
    },
    {
      category: "Emotional Expression",
      status: hasEmotionalLanguage && hasLogicalLanguage ? "High Friction" : "Aligned",
      explanation: hasEmotionalLanguage && hasLogicalLanguage
        ? "One leads with emotions while the other prefers logic, creating disconnection."
        : "Both share similar emotional expression styles."
    },
    {
      category: "Conflict Approach",
      status: "Potential Friction",
      explanation: "One person seeks immediate resolution while the other needs processing time."
    },
    {
      category: "Validation Needs",
      status: conversation.includes('understand') ? "Aligned" : "High Friction",
      explanation: "Differing needs for emotional validation during conflicts."
    },
    {
      category: "Communication Timing",
      status: "Potential Friction",
      explanation: "Mismatch in preferred timing for serious conversations."
    },
    {
      category: "Repair Strategies",
      status: conversation.includes('sorry') ? "Aligned" : "Potential Friction",
      explanation: "Different approaches to apologizing and making amends."
    }
  ];
}

export async function simulateCrisis(
  conflict: string,
  intensity: number,
  action: string
): Promise<CrisisSimulation> {
  const isPositiveAction = action.includes('apologize') || action.includes('listen');
  const isNegativeAction = action.includes('ignore') || action.includes('defend');

  const baseSuccess = isPositiveAction ? 0.7 : isNegativeAction ? 0.2 : 0.5;
  const intensityModifier = 1 - (intensity / 100) * 0.3;

  return {
    trust_change: isPositiveAction ? 0.25 : isNegativeAction ? -0.35 : -0.10,
    safety_change: isPositiveAction ? 0.18 : isNegativeAction ? -0.28 : -0.05,
    risk_of_escalation: isNegativeAction ? 0.75 : isPositiveAction ? 0.15 : 0.45,
    overall_success_probability: baseSuccess * intensityModifier,
    timeline: isPositiveAction
      ? "Expected recovery in 2-4 days with consistent follow-through."
      : isNegativeAction
      ? "Likely escalation within 24-48 hours. Repair difficulty increases significantly."
      : "Situation remains stagnant. No improvement expected without intervention."
  };
}

export async function generateRepairPlaybook(
  conflict: string,
  tone: 'apologetic' | 'assertive' | 'vulnerable' | 'collaborative'
): Promise<RepairPlaybook> {
  const playbooks = {
    apologetic: {
      sample_messages: [
        "I'm truly sorry for how I handled that. I can see now how my words hurt you, and that wasn't my intention.",
        "You were right to be upset. I should have been more thoughtful about your feelings.",
        "I take full responsibility for my part in this. Can we talk about how to move forward together?"
      ],
      avoid: [
        "Saying 'but' after apologizing",
        "Bringing up their mistakes",
        "Minimizing their feelings with 'I didn't mean it that way'"
      ],
      timing: "Within 24 hours while emotions are still fresh, but wait until both parties are calm.",
      expected_response: "They may be guarded initially but will likely soften if the apology feels genuine and specific."
    },
    assertive: {
      sample_messages: [
        "I need us to address how we communicate during disagreements. What happened wasn't okay with me.",
        "I care about fixing this, but I also need you to understand my perspective on what went wrong.",
        "I'm willing to work on this together, but I need to see that you're equally committed to change."
      ],
      avoid: [
        "Accusatory 'you always' statements",
        "Ultimatums or threats",
        "Defensive justifications"
      ],
      timing: "When you're both calm and have privacy. Don't ambush them, but don't wait too long either.",
      expected_response: "They may feel called out initially, but clear boundaries can create respect if delivered with care."
    },
    vulnerable: {
      sample_messages: [
        "When this happened, I felt really hurt and small. I'm scared we're losing connection.",
        "I don't want to fight. I just want you to understand how much this affected me.",
        "I'm trying to be honest about my feelings because I care about us getting through this."
      ],
      avoid: [
        "Turning vulnerability into guilt-tripping",
        "Over-explaining to the point of exhaustion",
        "Expecting them to rescue you emotionally"
      ],
      timing: "When they're emotionally available, not when they're stressed or distracted.",
      expected_response: "Vulnerability often softens defensiveness, but only if they have capacity to hold space for it."
    },
    collaborative: {
      sample_messages: [
        "I think we both contributed to this going sideways. Can we figure out what happened together?",
        "I want to understand your side better. What did you need from me that I didn't give?",
        "Let's pause the blame game. What would a better version of this conversation look like?"
      ],
      avoid: [
        "False equivalencies ('we both messed up equally')",
        "Forcing collaboration before accountability",
        "Bypassing emotions to get to 'solutions'"
      ],
      timing: "After both parties have cooled down and feel ready to problem-solve, not mid-conflict.",
      expected_response: "Collaborative approaches work best when both people are secure enough to examine their role."
    }
  };

  return playbooks[tone];
}

export async function classifyConflict(conversation: string): Promise<ConflictType> {
  const hasAlways = conversation.toLowerCase().includes('always') || conversation.toLowerCase().includes('never');
  const hasSilence = conversation.toLowerCase().includes('ignore') || conversation.toLowerCase().includes('silent');
  const hasIntensity = conversation.toLowerCase().includes('angry') || conversation.toLowerCase().includes('yelling');

  if (hasAlways) {
    return {
      type: "Pattern Accusation",
      description: "One person is calling out a recurring behavior using absolutes like 'always' or 'never', which triggers defensiveness.",
      repair_strategy: "Replace absolute language with specific examples. Instead of 'you always,' say 'this time, when you...'"
    };
  } else if (hasSilence) {
    return {
      type: "Stonewalling / Withdrawal",
      description: "One person is shutting down or going silent, which leaves the other feeling abandoned and escalates anxiety.",
      repair_strategy: "The withdrawing person needs to communicate their need for space: 'I need 20 minutes to process, then we can talk.'"
    };
  } else if (hasIntensity) {
    return {
      type: "Escalation Spiral",
      description: "Both parties are raising intensity, volume, or harshness in a feedback loop that prevents resolution.",
      repair_strategy: "Call a time-out using a pre-agreed signal. Resume when both can speak calmly."
    };
  } else {
    return {
      type: "Unmet Needs Collision",
      description: "Both people have legitimate needs that feel mutually exclusive, creating an impasse.",
      repair_strategy: "Surface the underlying needs beneath the positions. Find creative solutions that address both needs."
    };
  }
}

export async function extractMicroEmotions(conversation: string): Promise<MicroEmotion[]> {
  const messages = conversation.split('\n').filter(m => m.trim());

  const emotionPatterns = [
    { keywords: ['sorry', 'apologize'], emotions: ['guilt', 'remorse', 'shame'], intensity: 0.7 },
    { keywords: ['always', 'never'], emotions: ['frustration', 'resentment', 'exasperation'], intensity: 0.8 },
    { keywords: ['don\'t care', 'whatever', 'fine'], emotions: ['dismissiveness', 'anger', 'hurt'], intensity: 0.75 },
    { keywords: ['hurt', 'pain'], emotions: ['vulnerability', 'sadness', 'betrayal'], intensity: 0.85 },
    { keywords: ['but', 'however'], emotions: ['defensiveness', 'justification', 'resistance'], intensity: 0.65 },
    { keywords: ['understand', 'hear'], emotions: ['empathy', 'openness', 'validation'], intensity: 0.6 },
    { keywords: ['need', 'want'], emotions: ['longing', 'desperation', 'clarity'], intensity: 0.7 }
  ];

  return messages.map((msg, idx) => {
    const lowerMsg = msg.toLowerCase();
    let matchedPattern = emotionPatterns.find(pattern =>
      pattern.keywords.some(kw => lowerMsg.includes(kw))
    );

    if (!matchedPattern) {
      matchedPattern = { emotions: ['confusion', 'uncertainty'], intensity: 0.5 };
    }

    return {
      msgIndex: idx + 1,
      emotions: matchedPattern.emotions,
      intensity: matchedPattern.intensity
    };
  });
}

export async function detectAttachmentStyles(conversation: string): Promise<AttachmentProfile> {
  const hasReassuranceSeeking = conversation.toLowerCase().includes('do you still') ||
                                  conversation.toLowerCase().includes('are we okay');
  const hasDistancing = conversation.toLowerCase().includes('need space') ||
                        conversation.toLowerCase().includes('overwhelm');
  const hasHypervigilance = conversation.toLowerCase().includes('always') &&
                            conversation.toLowerCase().includes('leave');

  let personA = "Secure";
  let personB = "Secure";
  const recommendations: string[] = [];

  if (hasReassuranceSeeking || hasHypervigilance) {
    personA = "Anxious";
    recommendations.push("Person A: Practice self-soothing techniques before seeking reassurance.");
    recommendations.push("Person B: Provide consistent communication to reduce Person A's anxiety.");
  }

  if (hasDistancing) {
    personB = "Avoidant";
    recommendations.push("Person B: Communicate need for space explicitly rather than withdrawing.");
    recommendations.push("Person A: Respect processing time without interpreting it as abandonment.");
  }

  if (personA === "Anxious" && personB === "Avoidant") {
    recommendations.push("Classic anxious-avoidant trap: Person A's pursuit triggers Person B's withdrawal, which triggers more pursuit.");
    recommendations.push("Break the cycle: Person A reduces intensity, Person B increases predictability.");
  }

  if (recommendations.length === 0) {
    recommendations.push("Both parties show secure attachment patterns.");
    recommendations.push("Continue practicing open communication and emotional availability.");
  }

  return {
    personA,
    personB,
    recommendations
  };
}

export async function generateRootCauseTree(conversation: string): Promise<RootCauseNode> {
  const hasUnmetNeeds = conversation.toLowerCase().includes('need') || conversation.toLowerCase().includes('want');
  const hasTrustIssues = conversation.toLowerCase().includes('trust') || conversation.toLowerCase().includes('believe');
  const hasStyleMismatch = conversation.toLowerCase().includes('always') || conversation.toLowerCase().includes('never');

  if (hasUnmetNeeds) {
    return {
      root: "Unmet Core Emotional Needs",
      branches: [
        { node: "Need for validation not being expressed" },
        { node: "Expectation mismatch about support" },
        { node: "One person prioritizing autonomy over connection" },
        { node: "Accumulated resentment from unspoken needs" }
      ]
    };
  } else if (hasTrustIssues) {
    return {
      root: "Eroded Trust Foundation",
      branches: [
        { node: "Past promises not kept" },
        { node: "Lack of emotional transparency" },
        { node: "One person feeling unheard or dismissed" },
        { node: "Inconsistent behavior creating unpredictability" }
      ]
    };
  } else if (hasStyleMismatch) {
    return {
      root: "Communication Style Incompatibility",
      branches: [
        { node: "Direct vs. Indirect communication collision" },
        { node: "Different processing speeds (immediate vs. reflective)" },
        { node: "Emotional vs. Logical conflict resolution styles" },
        { node: "Mismatched expectations for conflict engagement" }
      ]
    };
  } else {
    return {
      root: "Accumulated Micro-Resentments",
      branches: [
        { node: "Small slights building over time" },
        { node: "Lack of regular emotional check-ins" },
        { node: "Assumptions being made without verification" },
        { node: "Stress from external factors bleeding into relationship" }
      ]
    };
  }
}
