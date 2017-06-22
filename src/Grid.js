import React, { Component } from 'react';
import Node from './Node';
import GridMatches from './GridMatches';

import './Grid.css';
import './GridMatches.css';

export default class Grid extends Component {
  state = {
    matches: [],
  }

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
            addMatches={matches => {
              if (!matches) {
                return;
              }

              const newMatches = this.state.matches.slice();
              newMatches.push(matches);
              this.setState({matches: newMatches});
            } }
            removeMatches={matches => console.log(matches) } />
        );

        // TODO: Proper Remove Matches
        // TODO: Is this really faster?
      }
    }

    let id = 0;
    const matches = this.state.matches.map(nodes => {
      const startPosition = grid.positionOf(nodes[0]);
      const endPosition = grid.positionOf(nodes[nodes.length - 1]);

      return (
        <GridMatches
          key={`match${id++}`}
          fromX={startPosition.x}
          fromY={startPosition.y}
          toX={endPosition.x}
          toY={endPosition.y} />
      );
    });

    return (
      <div
        className='Grid'
        style={{gridTemplateColumns: `repeat(${cols}, minmax(1em, 2em))`}}>

        { nodes }
        { matches }
      </div>
    );
  }
}

