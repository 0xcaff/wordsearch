import { firestore } from "../firebase";
import { FullPuzzleData, puzzleCollectionName } from "../database";
import { findMatches, Match } from "wordsearch-algo/lib";
import { editDistance } from "../editDistance";
import {
  insertPuzzle,
  MatchInfo,
  MatchOrientation,
  pool,
  PuzzleComputedMetadata,
  resetDatabase,
  WordInfo,
} from "../analyticsDatabase";

function transformPuzzle(
  puzzles: FullPuzzleData[],
  puzzle: FullPuzzleData
): PuzzleComputedMetadata {
  const cells = puzzle.rows.join("").split("");

  return {
    id: puzzle.id,
    rows: puzzle.rows,
    created: puzzle.created,
    words: puzzle.words.map((word) => transformWord(word)),
    matches: findMatches(puzzle.rows, puzzle.words).map((match) =>
      transformMatch(match)
    ),

    isRowWidthConstant: isRowWidthConstant(puzzle.words),

    totalCells: cells.length,
    lowerCaseCells: cells.filter((cell) => cell.match(/[a-z]/)).length,
    upperCaseCells: cells.filter((cell) => cell.match(/[A-Z]/)).length,
    whitespaceCells: cells.filter((cell) => cell.match(/\s/)).length,
    otherCells: cells.filter((cell) => cell.match(/[^a-zA-Z\s]/)).length,

    similarPuzzles: findSimilarPuzzles(puzzles, puzzle),
  };
}

function transformWord(word: string): WordInfo {
  return {
    word,
    isMixedCase: word != word.toUpperCase() && word != word.toLowerCase(),
    includesNonWordCharacter: !!word.match(/[^a-z0-9]/i),
  };
}

function transformMatch(match: Match): MatchInfo {
  return {
    word: match.word,
    orientation: matchOrientationForMatch(match),
  };
}

function matchOrientationForMatch(match: Match): MatchOrientation | null {
  let colDelta = match.end.colIdx - match.start.colIdx;
  let rowDelta = match.end.rowIdx - match.start.rowIdx;

  if (colDelta < 0 && rowDelta > 0) {
    return "up_left";
  } else if (colDelta === 0 && rowDelta > 0) {
    return "up";
  } else if (colDelta > 0 && rowDelta > 0) {
    return "up_right";
  } else if (colDelta > 0 && rowDelta === 0) {
    return "right";
  } else if (colDelta > 0 && rowDelta < 0) {
    return "down_right";
  } else if (colDelta === 0 && rowDelta < 0) {
    return "down";
  } else if (colDelta < 0 && rowDelta < 0) {
    return "down_left";
  } else if (colDelta < 0 && rowDelta === 0) {
    return "left";
  } else {
    return null;
  }
}

function isRowWidthConstant(rows: string[]): boolean {
  return !rows.find((row) => row.length != rows[0].length);
}

function findSimilarPuzzles(
  puzzles: FullPuzzleData[],
  puzzle: FullPuzzleData
): string[] {
  return [];

  // TODO: dice coefficient

  return puzzles
    .filter((otherPuzzle) => {
      otherPuzzle.rows.length === puzzle.rows.length;
    })
    .filter((otherPuzzle) => {
      const calculatedEditDistance = editDistance(
        otherPuzzle.rows.join("\n").toLowerCase(),
        puzzle.rows.join("\n").toLowerCase()
      );
      return calculatedEditDistance < 10;
    })
    .map((puzzle) => puzzle.id);
}

async function main() {
  await resetDatabase();

  const puzzles = await firestore
    .collection(puzzleCollectionName)
    .get()
    .then((collection) =>
      collection.docs.map(
        (doc) =>
          ({
            id: doc.id,
            ...doc.data(),
          } as FullPuzzleData)
      )
    );

  // TODO: logging
  await Promise.all(
    mapWithProgressLogging(puzzles, async (puzzle) => {
      const transformed = transformPuzzle(puzzles, puzzle);
      await insertPuzzle(transformed);
    })
  );

  console.log("done");

  await firestore.terminate();
  await pool.end();
}

main();

function mapWithProgressLogging<T, U>(
  array: T[],
  mapper: (input: T) => U
): U[] {
  const output = [];

  for (let i = 0; i < array.length; i++) {
    const item = array[i];
    const out = mapper(item);
    console.log(`item ${i}`, item);

    output.push(out);
  }

  return output;
}
