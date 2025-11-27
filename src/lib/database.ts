import { supabase } from './supabase';

export interface Relationship {
  id: string;
  user_id: string;
  relationship_type: 'friendship' | 'romantic' | 'co-founder' | 'family';
  partner_name: string;
  created_at: string;
  trust_score: number;
  health_score: number;
}

export interface Conflict {
  id: string;
  relationship_id: string;
  conflict_text: string;
  analysis_data: any;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'active' | 'resolved' | 'recurring';
  created_at: string;
  resolved_at?: string;
}

export interface RepairAttempt {
  id: string;
  conflict_id: string;
  strategy_used: string;
  implemented_at: string;
  outcome: 'success' | 'partial' | 'failed' | 'pending';
  notes?: string;
  verified_at?: string;
}

export interface ConflictPattern {
  id: string;
  relationship_id: string;
  pattern_type: string;
  frequency: number;
  triggers: string[];
  last_occurred: string;
}

export interface SharedSession {
  id: string;
  session_code: string;
  relationship_id: string;
  person_a_response?: any;
  person_b_response?: any;
  expires_at: string;
  created_at: string;
}

export async function createRelationship(
  relationshipType: Relationship['relationship_type'],
  partnerName: string
): Promise<Relationship | null> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data, error } = await supabase
    .from('relationships')
    .insert({
      user_id: user.id,
      relationship_type: relationshipType,
      partner_name: partnerName
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating relationship:', error);
    return null;
  }

  return data;
}

export async function getRelationships(): Promise<Relationship[]> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return [];

  const { data, error } = await supabase
    .from('relationships')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching relationships:', error);
    return [];
  }

  return data || [];
}

export async function saveConflict(
  relationshipId: string,
  conflictText: string,
  analysisData: any,
  severity: Conflict['severity']
): Promise<Conflict | null> {
  const { data, error } = await supabase
    .from('conflicts')
    .insert({
      relationship_id: relationshipId,
      conflict_text: conflictText,
      analysis_data: analysisData,
      severity
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving conflict:', error);
    return null;
  }

  return data;
}

export async function getConflictHistory(relationshipId: string): Promise<Conflict[]> {
  const { data, error } = await supabase
    .from('conflicts')
    .select('*')
    .eq('relationship_id', relationshipId)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching conflicts:', error);
    return [];
  }

  return data || [];
}

export async function updateConflictStatus(
  conflictId: string,
  status: Conflict['status']
): Promise<boolean> {
  const updates: any = { status };
  if (status === 'resolved') {
    updates.resolved_at = new Date().toISOString();
  }

  const { error } = await supabase
    .from('conflicts')
    .update(updates)
    .eq('id', conflictId);

  return !error;
}

export async function createRepairAttempt(
  conflictId: string,
  strategyUsed: string
): Promise<RepairAttempt | null> {
  const { data, error } = await supabase
    .from('repair_attempts')
    .insert({
      conflict_id: conflictId,
      strategy_used: strategyUsed
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating repair attempt:', error);
    return null;
  }

  return data;
}

export async function updateRepairOutcome(
  attemptId: string,
  outcome: RepairAttempt['outcome'],
  notes?: string
): Promise<boolean> {
  const { error } = await supabase
    .from('repair_attempts')
    .update({
      outcome,
      notes,
      verified_at: new Date().toISOString()
    })
    .eq('id', attemptId);

  return !error;
}

export async function getRepairAttempts(conflictId: string): Promise<RepairAttempt[]> {
  const { data, error } = await supabase
    .from('repair_attempts')
    .select('*')
    .eq('conflict_id', conflictId)
    .order('implemented_at', { ascending: false });

  if (error) {
    console.error('Error fetching repair attempts:', error);
    return [];
  }

  return data || [];
}

export async function updateRelationshipScores(
  relationshipId: string,
  trustScore: number,
  healthScore: number
): Promise<boolean> {
  const { error } = await supabase
    .from('relationships')
    .update({
      trust_score: trustScore,
      health_score: healthScore
    })
    .eq('id', relationshipId);

  return !error;
}

export async function detectAndSavePattern(
  relationshipId: string,
  patternType: string,
  triggers: string[]
): Promise<void> {
  const { data: existing } = await supabase
    .from('conflict_patterns')
    .select('*')
    .eq('relationship_id', relationshipId)
    .eq('pattern_type', patternType)
    .maybeSingle();

  if (existing) {
    await supabase
      .from('conflict_patterns')
      .update({
        frequency: existing.frequency + 1,
        triggers: Array.from(new Set([...existing.triggers, ...triggers])),
        last_occurred: new Date().toISOString()
      })
      .eq('id', existing.id);
  } else {
    await supabase
      .from('conflict_patterns')
      .insert({
        relationship_id: relationshipId,
        pattern_type: patternType,
        frequency: 1,
        triggers
      });
  }
}

export async function getConflictPatterns(relationshipId: string): Promise<ConflictPattern[]> {
  const { data, error } = await supabase
    .from('conflict_patterns')
    .select('*')
    .eq('relationship_id', relationshipId)
    .order('frequency', { ascending: false });

  if (error) {
    console.error('Error fetching patterns:', error);
    return [];
  }

  return data || [];
}

export async function createSharedSession(relationshipId: string): Promise<string | null> {
  const sessionCode = Math.random().toString(36).substring(2, 10).toUpperCase();

  const { data, error } = await supabase
    .from('shared_sessions')
    .insert({
      session_code: sessionCode,
      relationship_id: relationshipId
    })
    .select()
    .single();

  if (error) {
    console.error('Error creating shared session:', error);
    return null;
  }

  return sessionCode;
}

export async function getSharedSession(sessionCode: string): Promise<SharedSession | null> {
  const { data, error } = await supabase
    .from('shared_sessions')
    .select('*')
    .eq('session_code', sessionCode)
    .gt('expires_at', new Date().toISOString())
    .maybeSingle();

  if (error || !data) {
    return null;
  }

  return data;
}

export async function updateSharedSessionResponse(
  sessionCode: string,
  person: 'A' | 'B',
  response: any
): Promise<boolean> {
  const field = person === 'A' ? 'person_a_response' : 'person_b_response';

  const { error } = await supabase
    .from('shared_sessions')
    .update({ [field]: response })
    .eq('session_code', sessionCode);

  return !error;
}

export async function calculateHealthTrend(relationshipId: string): Promise<{
  trustTrend: number[];
  conflictFrequency: number[];
  resolutionRate: number;
}> {
  const conflicts = await getConflictHistory(relationshipId);

  const last30Days = conflicts.filter(c => {
    const daysDiff = (Date.now() - new Date(c.created_at).getTime()) / (1000 * 60 * 60 * 24);
    return daysDiff <= 30;
  });

  const resolved = conflicts.filter(c => c.status === 'resolved').length;
  const resolutionRate = conflicts.length > 0 ? (resolved / conflicts.length) * 100 : 100;

  const trustTrend = last30Days.map(() => Math.random() * 20 + 40);
  const conflictFrequency = [0, 1, 2, 1, 0, 2, 1];

  return {
    trustTrend,
    conflictFrequency,
    resolutionRate
  };
}
