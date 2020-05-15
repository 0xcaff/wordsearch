import { Pool, PoolClient } from "pg";
import { promises as fs } from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

export const pool = new Pool();

export interface PuzzleComputedMetadata {
  id: string;
  rows: string[];
  words: WordInfo[];
  matches: MatchInfo[];

  /**
   * If the puzzle has the same number of columns for every row.
   */
  isRowWidthConstant: boolean;

  totalCells: number;
  upperCaseCells: number;
  lowerCaseCells: number;
  whitespaceCells: number;
  otherCells: number;

  /**
   * Identifiers of similar puzzles. Two puzzles are similar if they have an edit distance of less than 10.
   */
  similarPuzzles: string[];
}

export interface WordInfo {
  word: string;

  /**
   * If this word is neither entirely upper or lower case.
   */
  isMixedCase: boolean;

  /**
   * Includes a non-alphanumeric character.
   */
  includesNonWordCharacter: boolean;
}

export interface MatchInfo {
  word: string;
  orientation: MatchOrientation | null;
}

export type MatchOrientation =
  | "up_left"
  | "up"
  | "up_right"
  | "right"
  | "down_right"
  | "down"
  | "down_left"
  | "left";

export async function resetDatabase() {
  const script = await fs.readFile(path.join(__dirname, "initialize.sql"));
  await pool.query(script.toString("utf-8"));
}

export async function insertPuzzle(puzzle: PuzzleComputedMetadata) {
  await withTx(async (client) => {
    await client.query(
      `INSERT INTO puzzles VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        puzzle.id,
        puzzle.rows,
        puzzle.isRowWidthConstant,
        puzzle.totalCells,
        puzzle.upperCaseCells,
        puzzle.lowerCaseCells,
        puzzle.whitespaceCells,
        puzzle.otherCells,
      ]
    );

    await Promise.all(
      puzzle.similarPuzzles.map((otherPuzzle) =>
        client.query(
          `INSERT INTO similar_puzzles VALUES ($1, $2)`,
          [puzzle.id, otherPuzzle].sort()
        )
      )
    );

    await Promise.all(
      puzzle.words.map((word) =>
        client.query(`INSERT INTO words VALUES ($1, $2, $3, $4)`, [
          word.word,
          puzzle.id,
          word.isMixedCase,
          word.includesNonWordCharacter,
        ])
      )
    );

    await Promise.all(
      puzzle.matches.map((match) =>
        client.query(`INSERT INTO matches VALUES ($1, $2, $3)`, [
          match.word,
          puzzle.id,
          match.orientation,
        ])
      )
    );
  });
}

async function withTx(fn: (client: PoolClient) => Promise<void>) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await fn(client);
    await client.query("COMMIT");
  } catch (e) {
    await client.query("ROLLBACK");
    throw e;
  } finally {
    client.release();
  }
}
