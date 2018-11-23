import { puzzles } from "wordsearch-algo";
import { firestore } from "../src/firebase";

Promise.all(
  puzzles.map(puzzle =>
    firestore
      .collection("puzzles")
      .doc(puzzle.name)
      .set({ rows: puzzle.rows, words: puzzle.words })
  )
);
