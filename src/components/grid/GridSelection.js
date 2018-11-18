import React, { PureComponent } from 'react';
import { component as componentClass } from './GridSelection.module.css';

// A component which highlights nodes between two points.
export default class GridSelection extends PureComponent {
  render() {
    const { selection, grid } = this.props;

    const startNode = selection[0];
    const { x: fromX, y: fromY } = grid.positionOf(startNode);

    const endNode = selection[selection.length - 1];
    const { x: toX, y: toY } = grid.positionOf(endNode);

    return Array.from(tweenPosition(fromX, fromY, toX, toY))
      .map(({x, y}) =>
        <div
          key={`${x},${y}`}
          className={componentClass}
          style={{
            gridColumnStart: x + 1,
            gridRowStart: y + 1,
          }} />
    );
  }
}

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

  yield {x: dx ? x++ : x, y: dy ? y++ : y};
}

function moveTowards(number, towards) {
  if (number > towards) {
    number--;
  } else if (number < towards) {
    number++;
  }

  return number;
}

