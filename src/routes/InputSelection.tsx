import React from "react";
import { Link } from "react-router-dom";

import buttonStyles from "../components/Button.module.css";
import sharedStyles from "../components/shared.module.css";
import styles from "./InputSelection.module.css";
import { puzzles } from "wordsearch-algo";
import { join } from "../utils";

const InputSelection = () => {
  return (
    <div className={styles.component}>
      <header className={styles.header}>
        <h1>The Wordsearch Solver</h1>
      </header>

      <main className={styles.content}>
        <div className={styles.buttonContainer}>
          <Link
            className={[styles.button, buttonStyles.button].join(" ")}
            to="/input/text"
          >
            Enter Text
          </Link>
        </div>

        <DemoPuzzles />

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

const DemoPuzzles = () => {
  const commaElem = <span>, </span>;
  const textArr = puzzles.map(puzzle => (
    <Link
      className={sharedStyles.clickable}
      key={puzzle.name}
      to={`/view/${puzzle.name}`}
    >
      {puzzle.name}
    </Link>
  ));

  const textPuzzles = join(textArr, commaElem).map((element, idx) =>
    React.cloneElement(element, { key: idx })
  );

  return (
    <p className={styles.demos}>Try one of these puzzles: {textPuzzles}.</p>
  );
};
