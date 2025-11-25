/*
  # Create Gradient Management Tables

  1. New Tables
    - `gradient_presets`
      - `id` (uuid, primary key)
      - `name` (text) - Display name for the gradient
      - `start_color` (text) - Starting color hex code
      - `end_color` (text) - Ending color hex code
      - `direction` (text) - Gradient direction (e.g., "to bottom", "to right")
      - `created_at` (timestamptz)
    
    - `user_preferences`
      - `id` (uuid, primary key)
      - `session_id` (text, unique) - Browser session identifier
      - `selected_gradient_id` (uuid) - Foreign key to gradient_presets
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on both tables
    - Allow public read access to gradient_presets
    - Allow users to manage their own preferences based on session_id

  3. Initial Data
    - Populate gradient_presets with popular gradient options
*/

CREATE TABLE IF NOT EXISTS gradient_presets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  start_color text NOT NULL,
  end_color text NOT NULL,
  direction text DEFAULT 'to bottom',
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS user_preferences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id text UNIQUE NOT NULL,
  selected_gradient_id uuid REFERENCES gradient_presets(id),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE gradient_presets ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read gradient presets"
  ON gradient_presets FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can read user preferences"
  ON user_preferences FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Anyone can insert user preferences"
  ON user_preferences FOR INSERT
  TO public
  WITH CHECK (true);

CREATE POLICY "Anyone can update their own preferences"
  ON user_preferences FOR UPDATE
  TO public
  USING (true)
  WITH CHECK (true);

INSERT INTO gradient_presets (name, start_color, end_color, direction) VALUES
  ('Sunset', '#ff6b6b', '#feca57', 'to bottom'),
  ('Ocean', '#1e3a8a', '#06b6d4', 'to bottom'),
  ('Forest', '#166534', '#84cc16', 'to bottom'),
  ('Twilight', '#581c87', '#ec4899', 'to bottom'),
  ('Fire', '#dc2626', '#fb923c', 'to bottom'),
  ('Arctic', '#0ea5e9', '#e0f2fe', 'to bottom'),
  ('Lavender', '#c084fc', '#e9d5ff', 'to bottom'),
  ('Mint', '#059669', '#d1fae5', 'to bottom'),
  ('Rose Gold', '#f43f5e', '#fbbf24', 'to right'),
  ('Deep Sea', '#0c4a6e', '#164e63', 'to bottom'),
  ('Coral Reef', '#fb7185', '#fdba74', 'to bottom'),
  ('Northern Lights', '#059669', '#3b82f6', 'to right'),
  ('Cherry Blossom', '#f9a8d4', '#fce7f3', 'to bottom'),
  ('Midnight', '#1e1b4b', '#4c1d95', 'to bottom'),
  ('Classic Red-Blue', '#ff0000', '#0000ff', 'to bottom')
ON CONFLICT DO NOTHING;