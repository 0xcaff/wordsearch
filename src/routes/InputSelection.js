import React from 'react';

import Button from '../components/Button';

import { puzzles } from 'wordsearch-algo';

import { join } from "../processing/utils";
import { unique } from '../processing/reactUtils';

import {
  component as componentClass, header as headerClass, content as contentClass,
  buttonContainer, button, demos, githubLink
} from './InputSelection.module.css';

import { clickable } from '../components/shared.module.css';

const InputSelection = (props) => {
  const { history } = props;

  return (
    <div className={componentClass}>
      <header className={headerClass}>
        <h1>The Wordsearch Solver</h1>
      </header>

      <main className={contentClass}>
        <div className={buttonContainer}>
          <Button
            className={button}
            onClick={() => history.push('/input/text')}>

            Select from Text
          </Button>
        </div>

        <DemoPuzzles
          onClickPuzzle={ name => history.push(`/view/${name}`) } />

        <a
          className={githubLink}
          href='https://github.com/0xcaff/wordsearch'>
          Fork Me On Github!
        </a>

      </main>
    </div>
  );
}

export default InputSelection;

const DemoPuzzles = (props) => {
  const { onClickPuzzle } = props;

  const commaElem = <span>, </span>;
  const textArr = Object.entries(puzzles)
    .map(([ name ]) =>
      <span
        className={clickable}
        onClick={_ => onClickPuzzle(name)}>
          { name }
      </span>
    );

  const textPuzzles = unique(join(textArr, commaElem));

  return (
    <p className={demos}>
      Try one of these puzzles: { textPuzzles }.
    </p>
  );
}
