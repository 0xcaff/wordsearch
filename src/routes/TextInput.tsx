import React, { useEffect, useState } from "react";

import TextEntry from "../components/TextEntry";
import MutableList from "../components/MutableList";
import Button from "../components/Button";

import styles from "./TextInput.module.css";
import { useTrack } from "../clientAnalyticsEvents";
import { puzzleLengthForRows } from "../analyticsEvents";

interface Props {
  startingRows: string[];
  startingWords: string[];
  solvePuzzle: (rows: string[], words: string[]) => void;
}

const TextInput = (props: Props) => {
  const track = useTrack();

  const startingRows = props.startingRows || [];
  const startingWords = props.startingWords || [];

  useEffect(() => {
    track("input:view", {
      totalWordsCount: startingWords.length,
      puzzleLength: puzzleLengthForRows(startingRows),
      puzzleRows: startingRows.length,
    });
  }, [track, startingRows, startingWords]);

  const [text, setText] = useState(startingRows.join("\n"));
  const [words, setWords] = useState(startingWords);

  return (
    <div className={styles.component}>
      <header className={styles.header}>
        <h1>Input Wordsearch Text</h1>
      </header>

      <main className={styles.content}>
        <TextEntry value={text} placeholder="Enter puzzle" onChange={setText} />

        <MutableList items={words} onChange={setWords}>
          {(item) => item}
        </MutableList>
      </main>

      <footer className={styles.footer}>
        <Button
          onClick={() => {
            const rows = text.split("\n");

            track("input:clickSolvePuzzle", {
              totalWordsCount: words.length,
              puzzleLength: text.length,
              puzzleRows: rows.length,
            });

            props.solvePuzzle(rows, words);
          }}
        >
          Solve Puzzle!
        </Button>
      </footer>
    </div>
  );
};

export default TextInput;
