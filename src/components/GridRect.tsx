import React from "react";
import { Shape } from "react-konva";

interface Props {
  rows: number;
  cols: number;

  x: number;
  y: number;
  width: number;
  height: number;
}

const GridRect = (props: Props) => (
  <Shape
    sceneFunc={(context, shape) => {
      context.beginPath();

      const colWidth = props.width / (props.cols - 1);
      const rowHeight = props.height / (props.rows - 1);

      for (let rowIdx = 0; rowIdx < props.rows; rowIdx++) {
        const y = props.y + rowHeight * rowIdx;

        context.moveTo(props.x, y);
        context.lineTo(props.x + props.width, y);
      }

      for (let colIdx = 0; colIdx < props.cols; colIdx++) {
        const x = props.x + colWidth * colIdx;

        context.moveTo(x, props.y);
        context.lineTo(x, props.y + props.height);
      }

      context.fillStrokeShape(shape);
    }}
    stroke="black"
    strokeWidth={4}
  />
);

export default GridRect;
