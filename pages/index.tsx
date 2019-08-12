import React from "react";
import Link from "next/link";

import buttonStyles from "../src/components/Button.module.css";
import sharedStyles from "../src/components/shared.module.css";
import styles from "./index.module.css";
import { puzzles } from "wordsearch-algo";
import { join } from "../src/utils";
import "../src/index.css";

export default () => {
  return (
    <div className={styles.component}>
      <header className={styles.header}>
        <h1>The Wordsearch Solver</h1>
      </header>

      <main className={styles.content}>
        <div className={styles.buttonContainer}>
          <Link href="/input/text">
            <a className={[styles.button, buttonStyles.button].join(" ")}>
              Enter Text
            </a>
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

const DemoPuzzles = () => {
  const commaElem = <span>, </span>;
  const textArr = puzzles.map(puzzle => (
    <Link key={puzzle.name} href={`/view/${puzzle.name}`}>
      <a className={sharedStyles.clickable}>{puzzle.name}</a>
    </Link>
  ));

  const textPuzzles = join(textArr, commaElem).map((element, idx) =>
    React.cloneElement(element, { key: idx })
  );

  return (
    <p className={styles.demos}>Try one of these puzzles: {textPuzzles}.</p>
  );
};
