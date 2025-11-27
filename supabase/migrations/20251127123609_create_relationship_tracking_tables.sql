/*
  # Relationship Tracking System

  1. New Tables
    - `relationships`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to auth.users)
      - `relationship_type` (text: friendship, romantic, co-founder, family)
      - `partner_name` (text)
      - `created_at` (timestamptz)
      - `trust_score` (numeric, default 50)
      - `health_score` (numeric, default 50)
    
    - `conflicts`
      - `id` (uuid, primary key)
      - `relationship_id` (uuid, foreign key)
      - `conflict_text` (text)
      - `analysis_data` (jsonb)
      - `severity` (text)
      - `status` (text: active, resolved, recurring)
      - `created_at` (timestamptz)
      - `resolved_at` (timestamptz, nullable)
    
    - `repair_attempts`
      - `id` (uuid, primary key)
      - `conflict_id` (uuid, foreign key)
      - `strategy_used` (text)
      - `implemented_at` (timestamptz)
      - `outcome` (text: success, partial, failed, pending)
      - `notes` (text, nullable)
      - `verified_at` (timestamptz, nullable)
    
    - `conflict_patterns`
      - `id` (uuid, primary key)
      - `relationship_id` (uuid, foreign key)
      - `pattern_type` (text)
      - `frequency` (integer)
      - `triggers` (text[])
      - `last_occurred` (timestamptz)
    
    - `shared_sessions`
      - `id` (uuid, primary key)
      - `session_code` (text, unique)
      - `relationship_id` (uuid, foreign key)
      - `person_a_response` (jsonb, nullable)
      - `person_b_response` (jsonb, nullable)
      - `expires_at` (timestamptz)
      - `created_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Users can only access their own relationships and conflicts
    - Shared sessions accessible via session_code
*/

CREATE TABLE IF NOT EXISTS relationships (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  relationship_type text NOT NULL CHECK (relationship_type IN ('friendship', 'romantic', 'co-founder', 'family')),
  partner_name text NOT NULL,
  created_at timestamptz DEFAULT now(),
  trust_score numeric DEFAULT 50 CHECK (trust_score >= 0 AND trust_score <= 100),
  health_score numeric DEFAULT 50 CHECK (health_score >= 0 AND health_score <= 100)
);

CREATE TABLE IF NOT EXISTS conflicts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id uuid REFERENCES relationships(id) ON DELETE CASCADE,
  conflict_text text NOT NULL,
  analysis_data jsonb DEFAULT '{}'::jsonb,
  severity text CHECK (severity IN ('low', 'medium', 'high', 'critical')),
  status text DEFAULT 'active' CHECK (status IN ('active', 'resolved', 'recurring')),
  created_at timestamptz DEFAULT now(),
  resolved_at timestamptz
);

CREATE TABLE IF NOT EXISTS repair_attempts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conflict_id uuid REFERENCES conflicts(id) ON DELETE CASCADE,
  strategy_used text NOT NULL,
  implemented_at timestamptz DEFAULT now(),
  outcome text DEFAULT 'pending' CHECK (outcome IN ('success', 'partial', 'failed', 'pending')),
  notes text,
  verified_at timestamptz
);

CREATE TABLE IF NOT EXISTS conflict_patterns (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  relationship_id uuid REFERENCES relationships(id) ON DELETE CASCADE,
  pattern_type text NOT NULL,
  frequency integer DEFAULT 1,
  triggers text[] DEFAULT ARRAY[]::text[],
  last_occurred timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shared_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_code text UNIQUE NOT NULL,
  relationship_id uuid REFERENCES relationships(id) ON DELETE CASCADE,
  person_a_response jsonb,
  person_b_response jsonb,
  expires_at timestamptz DEFAULT (now() + interval '7 days'),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE relationships ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflicts ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE conflict_patterns ENABLE ROW LEVEL SECURITY;
ALTER TABLE shared_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own relationships"
  ON relationships FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own relationships"
  ON relationships FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own relationships"
  ON relationships FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view conflicts in their relationships"
  ON conflicts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = conflicts.relationship_id
      AND relationships.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create conflicts in their relationships"
  ON conflicts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = conflicts.relationship_id
      AND relationships.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update conflicts in their relationships"
  ON conflicts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = conflicts.relationship_id
      AND relationships.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = conflicts.relationship_id
      AND relationships.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view repair attempts for their conflicts"
  ON repair_attempts FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conflicts
      JOIN relationships ON relationships.id = conflicts.relationship_id
      WHERE conflicts.id = repair_attempts.conflict_id
      AND relationships.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create repair attempts for their conflicts"
  ON repair_attempts FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conflicts
      JOIN relationships ON relationships.id = conflicts.relationship_id
      WHERE conflicts.id = repair_attempts.conflict_id
      AND relationships.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can update their repair attempts"
  ON repair_attempts FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM conflicts
      JOIN relationships ON relationships.id = conflicts.relationship_id
      WHERE conflicts.id = repair_attempts.conflict_id
      AND relationships.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conflicts
      JOIN relationships ON relationships.id = conflicts.relationship_id
      WHERE conflicts.id = repair_attempts.conflict_id
      AND relationships.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can view patterns for their relationships"
  ON conflict_patterns FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = conflict_patterns.relationship_id
      AND relationships.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can manage patterns for their relationships"
  ON conflict_patterns FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = conflict_patterns.relationship_id
      AND relationships.user_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = conflict_patterns.relationship_id
      AND relationships.user_id = auth.uid()
    )
  );

CREATE POLICY "Anyone can view shared sessions with valid code"
  ON shared_sessions FOR SELECT
  TO anon, authenticated
  USING (expires_at > now());

CREATE POLICY "Anyone can update shared sessions with valid code"
  ON shared_sessions FOR UPDATE
  TO anon, authenticated
  USING (expires_at > now())
  WITH CHECK (expires_at > now());

CREATE POLICY "Authenticated users can create shared sessions"
  ON shared_sessions FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM relationships
      WHERE relationships.id = shared_sessions.relationship_id
      AND relationships.user_id = auth.uid()
    )
  );

CREATE INDEX IF NOT EXISTS idx_conflicts_relationship_id ON conflicts(relationship_id);
CREATE INDEX IF NOT EXISTS idx_conflicts_created_at ON conflicts(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_repair_attempts_conflict_id ON repair_attempts(conflict_id);
CREATE INDEX IF NOT EXISTS idx_shared_sessions_code ON shared_sessions(session_code);
CREATE INDEX IF NOT EXISTS idx_conflict_patterns_relationship_id ON conflict_patterns(relationship_id);
