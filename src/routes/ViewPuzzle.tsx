import React, { useState } from "react";
import styles from "./ViewPuzzle.module.css";
import Button from "../components/Button";
import Puzzle from "../components/Puzzle";
import WordList from "../components/WordList";
import { Set } from "immutable";

interface Props {
  rows: string[];
  words: string[];
  toEditor: () => void;
}

const ViewPuzzle = (props: Props) => {
  /**
   * Set of words which are focused. A word is focused when it is highlighted in the When a word is focused it becomes highlighted in the word list.
   */
  const [focused, setFocused] = useState<Set<string>>(Set());

  /**
   * Word which is selected. A word is selected when moused over in the word list.
   */
  const [selectedWord, setSelectedWord] = useState<string | undefined>(
    undefined
  );

  return (
    <div className={styles.container}>
      <div className={styles.mainArea}>
        <Puzzle
          words={props.words}
          rows={props.rows}
          focusWords={words =>
            setFocused(focused => focused.clear().concat(words))
          }
          selectedWord={selectedWord}
        />
      </div>

      <div className={styles.sidebar}>
        <WordList
          words={props.words.map(word => ({
            word,
            isFocused: focused.has(word)
          }))}
          onSelectWord={setSelectedWord}
          onUnSelectWord={() => setSelectedWord(undefined)}
        />

        <Button className={styles.backButton} onClick={props.toEditor}>
          Edit
        </Button>
      </div>
    </div>
  );
};

export default ViewPuzzle;
