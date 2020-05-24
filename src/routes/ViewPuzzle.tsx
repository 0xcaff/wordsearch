import React, { useEffect, useMemo, useState } from "react";
import styles from "./ViewPuzzle.module.css";
import Button from "../components/Button";
import Puzzle, { getMatches } from "../components/Puzzle";
import WordList from "../components/WordList";
import { Set } from "immutable";
import { ResolvedData, usePuzzle } from "../components/usePuzzle";
import { useWithLoading } from "../components/useWithLoading";
import { database, PuzzleData } from "../database";
import { NotFound } from "../components/NotFound";
import { useTrack, useTrackFn } from "../clientAnalyticsEvents";
import { puzzleLengthForRows, PuzzleViewProperties } from "../analyticsEvents";

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

  const trackClickEdit = useTrackFn("puzzle:clickEdit", {});
  const trackClickSave = useTrackFn("puzzle:clickSave", {});

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

        <Button
          className={styles.button}
          onClick={() => {
            trackClickEdit();
            props.toEditor();
          }}
        >
          Edit
        </Button>

        {!props.isFromRemote && (
          <Button
            className={[styles.button, props.isCreating && styles.loading]
              .filter((e) => !!e)
              .join(" ")}
            onClick={() => {
              trackClickSave();

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

  useTrackPuzzleView(puzzle);

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

function useTrackPuzzleView(puzzle: ResolvedData | null) {
  const track = useTrack();
  const trackingProperties = useMemo<PuzzleViewProperties | null>(() => {
    if (puzzle === null) {
      return null;
    }

    if (puzzle.isFromLocal) {
      return {
        type: "local",
        puzzleLength: puzzleLengthForRows(puzzle.data.rows),
        totalWordsCount: puzzle.data.words.length,
        matchesCount: getMatches(puzzle.data.rows, puzzle.data.words).length,
        puzzleRows: puzzle.data.rows.length,
      };
    }

    return {
      type: "remote",
      id: puzzle.id,
    };
  }, [puzzle]);

  const serializedTrackingProperties = JSON.stringify(trackingProperties);

  useEffect(() => {
    if (trackingProperties) {
      track("puzzle:view", trackingProperties);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [track, serializedTrackingProperties]);
}
