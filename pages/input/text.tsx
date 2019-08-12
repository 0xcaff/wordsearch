import React, { useState } from "react";
import Router from "next/router";
import { NextPageContext } from "next";

import TextEntry from "../../src/components/TextEntry";
import MutableList from "../../src/components/MutableList";
import Button from "../../src/components/Button";

import styles from "./text.module.css";

interface Props {
  startingRows: string[];
  startingWords: string[];
}

const TextInput = (props: Props) => {
  const startingRows = props.startingRows || [];
  const startingWords = props.startingWords || [];
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
          {item => item}
        </MutableList>
      </main>

      <footer className={styles.footer}>
        <Button
          onClick={() =>
            Router.push({
              pathname: "/view",
              query: { rows: text.split("\n"), words }
            })
          }
        >
          Solve Puzzle!
        </Button>
      </footer>
    </div>
  );
};

TextInput.getInitialProps = (context: NextPageContext): Props => {
  return {
    startingRows: context.query.rows,
    startingWords: context.query.words
  };

  console.log(context);
};

export default TextInput;
