import React from 'react';

import Button from '../components/Button';
import InputButton from '../components/InputButton';
import puzzles from '../wordsearch/data';
import images from './images';

import { join } from '../processing/utils';
import { unique } from '../processing/reactUtils';

import './InputSelection.css';

// First component the user sees when the visit the site. It decides which input
// method to use to get the wordsearch (text or image).
const InputSelection = (props) => {
  const { history } = props;

  return (
    <div className='InputSelection'>
      <header>
        <h1>The Wordsearch Solver</h1>
      </header>

      <main>
        <div>
          <InputButton
            onChange={event => {
              if (
                !event || !event.target || !event.target.files ||
                !event.target.files.length) {

                return;
              }

              const [ file ] = event.target.files;
              history.push('/input/image', { file });
            }}>
              Select from Image
          </InputButton>

          <Button onClick={() => history.push('/input/text')}>
            Select from Text
          </Button>
        </div>

        <DemoPuzzles
          onClickPuzzle={
            ({ rows, words }) =>
              history.push('/view', { text: rows.join('\n'), words })
          }
          onClickImage={ image => history.push('/input/image', { image }) } />
      </main>
    </div>
  );
}

export default InputSelection;

const DemoPuzzles = (props) => {
  const { onClickPuzzle, onClickImage } = props;

  const commaElem = <span>, </span>;
  const textArr = Object.entries(puzzles)
    .map(([ name, puzzle ]) =>
      <span
        className='clickable'
        onClick={_ => onClickPuzzle(puzzle)}>
          { name }
      </span>
    );

  const textPuzzles = unique(join(textArr, commaElem));

  const imagesArr = images.map(({ name, image }) =>
    <span
      className='clickable'
      onClick={_ => onClickImage(image)}>
      { name }
    </span>
  );

  const imagePuzzles = unique(join(imagesArr, commaElem));

  return (
    <p className='DemoPuzzles'>
      Try one of these puzzles: { textPuzzles }, or one of these images: { imagePuzzles }.
    </p>
  );
}
