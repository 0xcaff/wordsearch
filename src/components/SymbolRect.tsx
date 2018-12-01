import React, { Component } from "react";
import { Rect } from "react-konva";
import { Symbol } from "../utils/google-cloud-vision-type";
import { boundingPolyToBox } from "../utils/google-cloud-vision";

interface Props {
  symbol: Symbol;
}

interface State {
  hovered: boolean;
}

class SymbolRect extends Component<Props, State> {
  state = { hovered: false };

  render(): React.ReactNode {
    const bounds = boundingPolyToBox(this.props.symbol.boundingBox);

    return (
      <Rect
        x={bounds.minX}
        y={bounds.minY}
        width={bounds.maxX - bounds.minX}
        height={bounds.maxY - bounds.minY}
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
        stroke={this.state.hovered ? "red" : "black"}
      />
    );
  }
}

export default SymbolRect;
