import React, { Component } from "react";
import { Rect } from "react-konva";
import { SymbolWithBoundingBox } from "../utils/googleCloudVision";
import { boundingBoxHeight, boundingBoxWidth } from "../utils/geom";

interface Props {
  symbol: SymbolWithBoundingBox;
}

interface State {
  hovered: boolean;
}

class SymbolRect extends Component<Props, State> {
  state = { hovered: false };

  render(): React.ReactNode {
    return (
      <Rect
        x={this.props.symbol.bounds.minX}
        y={this.props.symbol.bounds.minY}
        width={boundingBoxWidth(this.props.symbol.bounds)}
        height={boundingBoxHeight(this.props.symbol.bounds)}
        onMouseEnter={() => this.setState({ hovered: true })}
        onMouseLeave={() => this.setState({ hovered: false })}
        stroke={this.state.hovered ? "red" : "black"}
      />
    );
  }
}

export default SymbolRect;
