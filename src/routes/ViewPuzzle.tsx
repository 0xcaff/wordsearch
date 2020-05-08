import React, { useState } from "react";
import styles from "./ViewPuzzle.module.css";
import Button from "../components/Button";
import Puzzle from "../components/Puzzle";
import WordList from "../components/WordList";
import { Set } from "immutable";
import { usePuzzle } from "../components/usePuzzle";
import { useWithLoading } from "../components/useWithLoading";
import { database, PuzzleData } from "../database";
import { NotFound } from "../components/NotFound";

interface Props {
  rows: string[];
  words: string[];
  toEditor: () => void;

  isCreating: boolean;
  isFromRemote: boolean;
  onCreate: () => void;
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
          focusWords={(words) => setFocused((_) => Set(words))}
          selectedWord={selectedWord}
        />
      </div>

      <div className={styles.sidebar}>
        <WordList
          words={props.words.map((word) => ({
            word,
            isFocused: focused.has(word),
          }))}
          onSelectWord={setSelectedWord}
          onUnSelectWord={() => setSelectedWord(undefined)}
        />

        <Button className={styles.button} onClick={props.toEditor}>
          Edit
        </Button>

        {!props.isFromRemote && (
          <Button
            className={[styles.button, props.isCreating && styles.loading]
              .filter((e) => !!e)
              .join(" ")}
            onClick={() => {
              if (!props.isCreating) {
                props.onCreate();
              }
            }}
          >
            {props.isCreating ? "Loading..." : "Save"}
          </Button>
        )}
      </div>
    </div>
  );
};

interface ViewPuzzleWithDataProps {
  id?: string;
  puzzleData?: PuzzleData;
  viewPuzzle: (puzzleId: string) => void;
  toEditorWithPuzzle: (puzzle: PuzzleData) => void;
}

const ViewPuzzleWithData: React.FC<ViewPuzzleWithDataProps> = (
  props: ViewPuzzleWithDataProps
) => {
  const puzzle = usePuzzle({
    id: props.id,
    data: props.puzzleData,
  });

  const { load: create, isLoading: isCreating } = useWithLoading(
    async (puzzle: PuzzleData) => {
      const newPuzzle = await database.newPuzzle(puzzle);
      props.viewPuzzle(newPuzzle.id);
    }
  );

  if (puzzle === null) {
    return <NotFound />;
  }

  return (
    <ViewPuzzle
      words={puzzle.data.words}
      rows={puzzle.data.rows}
      toEditor={() => props.toEditorWithPuzzle(puzzle.data)}
      isFromRemote={!puzzle.isFromLocal}
      isCreating={isCreating}
      onCreate={() => create(puzzle.data)}
    />
  );
};

export default ViewPuzzleWithData;
