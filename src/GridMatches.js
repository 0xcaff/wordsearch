import React from 'react';
import './GridMatches.css';

// A component which highlights nodes between two points.
const GridMatches = (props) => {
  console.log("GridMatches.render");

  let { fromX, fromY, toX, toY } = props;

  return (
    <div
      className='GridMatches'>
      { Array.from(tweenPosition(fromX, fromY, toX, toY))
        .map(({x, y}) =>
          <div
            key={`${x},${y}`}
            className='Match'
            style={{
              gridColumnStart: x + 1,
              gridRowStart: y + 1,
            }} />
      ) }
    </div>
  );
};

// Yields values from {x: fromX, y: fromY} to {x: toX, y: toY} inclusive.
export function *tweenPosition(fromX, fromY, toX, toY) {
  let x = fromX;
  let y = fromY;

  const dy = toY - fromY;
  const dx = toX - fromX;

  while(x !== toX || y !== toY) {
    yield {x: x, y: y};

    // push by one
    x = moveTowards(x, toX);
    y = moveTowards(y, toY);
  }

  yield {x: dx ? x++ : 0, y: dy ? y++ : 0};
}

function moveTowards(number, towards) {
  if (number > towards) {
    number--;
  } else if (number < towards) {
    number++;
  }

  return number;
}

export default GridMatches;
