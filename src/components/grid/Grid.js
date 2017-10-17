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
          gridAutoColumns: 'minmax(1em, 2em)',
          margin: '0 auto',
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
