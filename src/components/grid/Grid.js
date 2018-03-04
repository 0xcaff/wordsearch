import React, { PureComponent } from "react";

import GridSelection from "./GridSelection";
import GridNodes from "./GridNodes";

import { component as componentClass } from "./Grid.css";

export default class Grid extends PureComponent {
  render() {
    const { grid, selected, nodeExtras, onSelect, onMouseLeave } = this.props;

    if (!grid) {
      return null;
    }

    return (
      <div className={componentClass} onMouseLeave={onMouseLeave}>
        <GridNodes grid={grid} extras={nodeExtras} onSelect={onSelect} />

        {selected.map((selection, i) => (
          <GridSelection key={`match${i}`} grid={grid} selection={selection} />
        ))}
      </div>
    );
  }
}
