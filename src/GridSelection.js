import React, { PureComponent } from 'react';
import './GridSelection.css';

// TODO: leaving this should make things happen

// A component which highlights nodes between two points.
export default class GridSelection extends PureComponent {
  render() {
    console.log("GridSelection.render");

    const { selection, grid, onUnselect } = this.props;

    const startNode = selection[0];
    const { x: fromX, y: fromY } = grid.positionOf(startNode);

    const endNode = selection[selection.length - 1];
    const { x: toX, y: toY } = grid.positionOf(endNode);

    return (
      <div
        className='GridMatches'
        onMouseLeave={_ => onUnselect(selection)}>
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
  }
}

// TODO: tweenPosition has a bug

// Yields values from {x: fromX, y: fromY} to {x: toX, y: toY} inclusive.
export function *tweenPosition(fromX, fromY, toX, toY) {
  const dy = toY - fromY;
  const dx = toX - fromX;

  let x = fromX;
  let y = fromY;

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

