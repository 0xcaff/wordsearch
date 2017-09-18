import React, { PureComponent } from 'react';

import GridSelection from './GridSelection';
import GridNodes from './GridNodes';

import './Grid.css';

export default class Grid extends PureComponent {
  render() {
    const { grid, selected, nodeExtras, onSelect, onUnselect } = this.props;

    if (!grid) {
      return null;
    }

    // collect selctions
    let id = 0;
    const gridSelectedNodes = selected.map(selection =>
      <GridSelection
        key={`match${id++}`}
        grid={grid}
        selection={selection}
        onUnselect={onUnselect} />
    );

    return (
      <div
        className='Grid'
        style={{gridTemplateColumns: `repeat(${grid.columns()}, minmax(1em, 2em))`}}>

        <GridNodes
          grid={grid}
          extras={nodeExtras}
          onSelect={onSelect} />

        { gridSelectedNodes }
      </div>
    );
  }
}
