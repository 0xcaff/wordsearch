import React, { Component } from 'react';

import GridMatches from './GridMatches';
import GridNodes from './GridNodes';

import './Grid.css';

// TODO: Potentially scu grid

export default class Grid extends Component {
  state = {
    matches: [],
  }

  extras = {
    // TODO: Proper Remove Matches
    addMatches: matches => {
      if (!matches) {
        return;
      }

      const newMatches = this.state.matches.slice();
      newMatches.push(matches);
      this.setState({matches: newMatches});
    },
    removeMatches: matches => console.log(matches),
  }

  render() {
    console.log("Grid.render");

    const { grid } = this.props;
    const { matches } = this.state;

    if (!grid) {
      return null;
    }

    // collect matches
    let id = 0;
    const gridMatchesNodes = matches.map(nodes => {
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
        style={{gridTemplateColumns: `repeat(${grid.columns()}, minmax(1em, 2em))`}}>

        <GridNodes
          grid={grid}
          extras={this.extras} />

        { gridMatchesNodes }
      </div>
    );
  }
}
