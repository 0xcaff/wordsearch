import React, { Component } from 'react';
import Node from './Node';

import './Grid.css';

export default class Grid extends Component {
  render() {
    console.log("Grid.render");

    if (!this.props.grid) {
      return null;
    }

    const grid = this.props.grid;

    // walk over grid and render nodes
    const nodes = [];
    const rows = grid.rows();
    const cols = grid.columns();

    for (let y = 0; y < rows; y++) {
      for (let x = 0; x < cols; x++) {
        const node = grid.get(x, y);
        if (!node) {
          continue;
        }

        nodes.push(
          <Node
            key={`${x},${y}`}
            x={x}
            y={y}
            node={node}
            updateNodes={_ => this.setState({grid: grid})} />
        );
      }
    }

    return (
      <div
        className='Grid'
        style={{gridTemplateColumns: `repeat(${cols}, minmax(1em, 2em))`}}>
        {nodes}
      </div>
    );
  }
}

const MarkOverlay = (props) => {
  let { x1, y1, x2, y2 } = props;
  if (x1 === x2) {
    x1 = x2 = 0.5;
  } else {
    // TODO: Contineu
  }

  if (y1 === y2) {
    y1 = y2 = 0.5;
  }

  return (
    <svg
      className='MarkOverlay'
      width="100%"
      height="100%"
      viewBox="0 0 1 1"
      preserveAspectRatio='none'
      style={{overflow: 'visible'}}>

      <line
        style={{
          strokeWidth: '1.1em',
          strokeLinecap: 'round',
          stroke: 'red',
        }}
        vectorEffect="non-scaling-stroke"
        x1="0"
        y1="0"
        x2="1"
        y2="1" />
    </svg>
  );
}
