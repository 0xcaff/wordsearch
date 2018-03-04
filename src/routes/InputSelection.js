import React from "react";

import Button from "../components/Button";
import InputButton from "../components/InputButton";

import { puzzles } from "wordsearch-algo";
import { images } from "./images";

import { join } from "../processing/utils";
import { unique } from "../processing/reactUtils";

import {
  component as componentClass,
  header as headerClass,
  content as contentClass,
  buttonContainer,
  button,
  demos,
  githubLink
} from "./InputSelection.css";

import { clickable } from "../components/shared.css";

// First component the user sees when the visit the site. It decides which input
// method to use to get the wordsearch (text or image).
const InputSelection = props => {
  const { history } = props;

  return (
    <div className={componentClass}>
      <header className={headerClass}>
        <h1>The Wordsearch Solver</h1>
      </header>

      <main className={contentClass}>
        <div className={buttonContainer}>
          <InputButton
            className={button}
            onChange={event => {
              if (
                !event ||
                !event.target ||
                !event.target.files ||
                !event.target.files.length
              ) {
                return;
              }

              const [file] = event.target.files;
              history.push("/input/image", { file });
            }}
          >
            Select from Image
          </InputButton>

          <Button
            className={button}
            onClick={() => history.push("/input/text")}
          >
            Select from Text
          </Button>
        </div>

        <DemoPuzzles
          onClickPuzzle={name => history.push(`/view/${name}`)}
          onClickImage={name => history.push(`/input/image/${name}`)}
        />

        <a className={githubLink} href="https://github.com/0xcaff/wordsearch">
          Fork Me On Github!
        </a>
      </main>
    </div>
  );
};

export default InputSelection;

const DemoPuzzles = props => {
  const { onClickPuzzle, onClickImage } = props;

  const commaElem = <span>, </span>;
  const textArr = Object.entries(puzzles).map(([name]) => (
    <span className={clickable} onClick={_ => onClickPuzzle(name)}>
      {name}
    </span>
  ));

  const textPuzzles = unique(join(textArr, commaElem));

  const imagesArr = images.map(({ name }) => (
    <span className={clickable} onClick={_ => onClickImage(name)}>
      {name}
    </span>
  ));

  const imagePuzzles = unique(join(imagesArr, commaElem));

  return (
    <p className={demos}>
      Try one of these puzzles: {textPuzzles}, or one of these images:{" "}
      {imagePuzzles}.
    </p>
  );
};
