import React from 'react';

import Button from './Button';
import InputButton from './InputButton';
import puzzles from './wordsearch/data';

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
          puzzles={puzzles}
          onClickPuzzle={ ({ rows, words }) => history.push('/view',
            { text: rows.join('\n'), words }) } />
      </main>
    </div>
  );
}

export default InputSelection;

const DemoPuzzles = (props) => {
  const { puzzles, onClickPuzzle } = props;

  const formatted = Object.entries(puzzles)
    .reduce((acc, [name, puzzle], idx, arr) => {
      const element = <span
        key={name}
        className='clickable'
        onClick={_ => onClickPuzzle(puzzle)}>
          {name}
      </span>

      acc.push(element);

      if (idx < arr.length - 1) {
        // add after all elements but last
        acc.push(<span key={`${name}-${idx}`}>, </span>);
      }

      return acc;
    }, []);

  return (
    <p className='DemoPuzzles'>
      Or try one of these puzzles: { formatted }.
    </p>
  );
}
