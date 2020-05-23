import { puzzles } from "wordsearch-algo";
import { firestore } from "../firebase";
import { puzzleCollectionName } from "../database";

Promise.all(
  puzzles.map((puzzle) =>
    firestore
      .collection(puzzleCollectionName)
      .doc(puzzle.name)
      .set({ rows: puzzle.rows, words: puzzle.words })
  )
);
