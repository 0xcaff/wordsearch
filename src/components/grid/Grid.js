import React, { PureComponent } from 'react';

import GridSelection from './GridSelection';
import GridNodes from './GridNodes';

import './Grid.css';

export default class Grid extends PureComponent {
  render() {
    const { grid, selected, nodeExtras, onSelect, onMouseLeave } = this.props;

    if (!grid) {
      return null;
    }

    return (
      <div
        className='Grid'
        onMouseLeave={onMouseLeave}
        style={{
          gridTemplateColumns: `repeat(${grid.columns()}, minmax(1em, 2em))`
        }}>

        <GridNodes
          grid={grid}
          extras={nodeExtras}
          onSelect={onSelect} />

        { selected.map((selection, i) =>
          <GridSelection
            key={`match${i}`}
            grid={grid}
            selection={selection} />
        ) }
      </div>
    );
  }
}
