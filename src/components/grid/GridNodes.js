import React, { PureComponent } from 'react';
import Node from './Node';

export default class GridNodes extends PureComponent {
  render() {
    const { grid, onSelect } = this.props;

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
            mouseEnterNode={node => onSelect(...node.partOf)} />
        );
      }
    }

    return nodes;
  }
};
