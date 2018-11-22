import React from "react";

import Button from "../components/Button";
import { puzzles } from "wordsearch-algo";
import { join } from "../utils";

import sharedStyles from "../components/shared.module.css";
import styles from "./InputSelection.module.css";

interface Props {
  goToTextInput: () => void;
  goToExample: (example: string) => void;
}

const InputSelection = (props: Props) => {
  return (
    <div className={styles.component}>
      <header className={styles.header}>
        <h1>The Wordsearch Solver</h1>
      </header>

      <main className={styles.content}>
        <div className={styles.buttonContainer}>
          <Button className={styles.button} onClick={props.goToTextInput}>
            Select from Text
          </Button>
        </div>

        <DemoPuzzles onClickPuzzle={props.goToExample} />

        <a
          className={styles.githubLink}
          href="https://github.com/0xcaff/wordsearch"
        >
          Fork Me On Github!
        </a>
      </main>
    </div>
  );
};

export default InputSelection;

interface DemoPuzzlesProps {
  onClickPuzzle: (name: string) => void;
}

const DemoPuzzles = (props: DemoPuzzlesProps) => {
  const commaElem = <span>, </span>;
  const textArr = puzzles.map(puzzle => (
    <span
      key={name}
      className={sharedStyles.clickable}
      onClick={() => props.onClickPuzzle(puzzle.name)}
    >
      {puzzle.name}
    </span>
  ));

  const textPuzzles = join(textArr, commaElem).map((element, idx) =>
    React.cloneElement(element, { key: idx })
  );

  return (
    <p className={styles.demos}>Try one of these puzzles: {textPuzzles}.</p>
  );
};
