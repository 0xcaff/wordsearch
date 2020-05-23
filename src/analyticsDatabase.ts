import { Pool, PoolClient } from "pg";
import { promises as fs } from "fs";
import path from "path";
import dotenv from "dotenv";
import firebase from "firebase";

dotenv.config();

export const pool = new Pool();

export interface PuzzleComputedMetadata {
  id: string;
  rows: string[];
  words: WordInfo[];
  created?: firebase.firestore.Timestamp;
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
  const script = (
    await fs.readFile(path.join(__dirname, "scripts/initialize.sql"))
  ).toString("utf-8");
  await pool.query(script);
}

export async function insertPuzzle(puzzle: PuzzleComputedMetadata) {
  await withTx(async (client) => {
    await client.query(
      `INSERT INTO puzzles VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        puzzle.id,
        puzzle.rows,
        puzzle.isRowWidthConstant,
        puzzle.totalCells,
        puzzle.upperCaseCells,
        puzzle.lowerCaseCells,
        puzzle.whitespaceCells,
        puzzle.otherCells,
        puzzle.created?.toDate() ?? null,
      ]
    );

    await client.query(
      `
      INSERT INTO similar_puzzles (
        SELECT
          (data->>0)::text,
          (data->>1)::text
        FROM 
          json_array_elements($1::json) AS data
      )
      `,
      [
        JSON.stringify(
          puzzle.similarPuzzles.map((otherPuzzleId) =>
            [puzzle.id, otherPuzzleId].sort()
          )
        ),
      ]
    );

    await client.query(
      `
      INSERT INTO words (
        SELECT
          (data->>0)::text,
          (data->>1)::text,
          (data->>2)::bool,
          (data->>3)::bool
        FROM
          json_array_elements($1::json) AS data
      )
      `,
      [
        JSON.stringify(
          puzzle.words.map((word) => [
            word.word,
            puzzle.id,
            word.isMixedCase,
            word.includesNonWordCharacter,
          ])
        ),
      ]
    );

    await client.query(
      `
      INSERT INTO matches (
        SELECT
          (data->>0)::text,
          (data->>1)::text,
          (data->>2)::orientation
        FROM
          json_array_elements($1::json) AS data
      )
      `,
      [
        JSON.stringify(
          puzzle.matches.map((match) => [
            match.word,
            puzzle.id,
            match.orientation,
          ])
        ),
      ]
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
