import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface ConflictAnalysis {
  id?: string;
  relationship_type: 'friendship' | 'co-founder' | 'romantic' | 'family';
  conflict_input: string;
  input_type: 'screenshot' | 'text' | 'voice_transcript';
  emotional_tone?: Record<string, unknown>;
  unmet_needs?: Array<unknown>;
  misunderstanding_root?: string;
  escalation_chain?: Array<unknown>;
  communication_dialects?: Record<string, unknown>;
  dialect_mismatch?: Record<string, unknown>;
  ripple_simulation?: Record<string, unknown>;
  repair_playbook?: Array<unknown>;
  created_at?: string;
}

export interface CrisisSimulation {
  id?: string;
  conflict_id: string;
  scenario_description: string;
  predicted_outcomes?: Array<unknown>;
  trust_degradation_score?: number;
  repair_difficulty?: 'easy' | 'moderate' | 'hard' | 'critical';
  created_at?: string;
}
