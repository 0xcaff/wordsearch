DROP TABLE IF EXISTS similar_puzzles;
DROP TABLE IF EXISTS matches;
DROP TABLE IF EXISTS words;
DROP TABLE IF EXISTS puzzles;
DROP TYPE IF EXISTS orientation;

CREATE TABLE puzzles(
  id text primary key,
  rows text[] NOT NULL,

  is_row_width_constant bool NOT NULL,

  total_cells int NOT NULL,
  upper_case_cells int NOT NULL,
  lower_case_cells int NOT NULL,
  whitespace_cells int NOT NULL,
  other_cells int NOT NULL,

  created_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE TABLE similar_puzzles(
  first_puzzle_id text NOT NULL REFERENCES puzzles(id),
  second_puzzle_id text NOT NULL REFERENCES puzzles(id),
  CHECK (first_puzzle_id < second_puzzle_id),
  UNIQUE (first_puzzle_id, second_puzzle_id)
);

CREATE TABLE words(
  word text NOT NULL,
  puzzle_id text NOT NULL REFERENCES puzzles(id),
  is_mixed_case bool NOT NULL,
  includes_non_word_character bool NOT NULL
);

CREATE TYPE orientation AS ENUM(
  'up_left',
  'up',
  'up_right',
  'right',
  'down_right',
  'down',
  'down_left',
  'left'
);

CREATE TABLE matches(
  word text NOT NULL,
  puzzle_id text NOT NULL REFERENCES puzzles(id),
  orientation orientation
);

CREATE TABLE IF NOT EXISTS events(
    name text NOT NULL,
    user_id text NOT NULL,
    session_id text NOT NULL,
    timestamp timestamp with time zone,
    properties json not null
);
