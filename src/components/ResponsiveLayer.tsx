import React from "react";
import Konva, { Vector2d } from "konva";
import { Layer } from "react-konva";

interface Props {
  dims: Dims;
  aspectRatio: Dims;
  children: React.ReactNode;
  onMouseDown: (position: Vector2d) => void;
  onMouseMove: (clicked: boolean, position: Vector2d) => void;
  onMouseUp: (position: Vector2d) => void;
}

interface Dims {
  width: number;
  height: number;
}

function positionOf<T>(e: Konva.KonvaEventObject<T>): Vector2d {
  return e.target.getStage().getPointerPosition();
}

const makeScaler = (scale: Vector2d) => (position: Vector2d): Vector2d => ({
  x: position.x * scale.x,
  y: position.y * scale.y
});

const makeTranslator = (translateBy: Vector2d) => (
  position: Vector2d
): Vector2d => ({
  x: position.x + translateBy.x,
  y: position.y + translateBy.y
});

const ResponsiveLayer = (props: Props) => {
  const widthByHeight =
    (props.aspectRatio.width / props.aspectRatio.height) * props.dims.height;

  const heightByWidth =
    (props.aspectRatio.height / props.aspectRatio.width) * props.dims.width;

  const width = Math.min(
    widthByHeight,
    props.dims.width,
    props.aspectRatio.width
  );
  const height = Math.min(
    heightByWidth,
    props.dims.height,
    props.aspectRatio.height
  );

  const left = (props.dims.width - width) / 2;
  const top = (props.dims.height - height) / 2;

  const scaleX = width / props.aspectRatio.width;
  const scaleY = height / props.aspectRatio.height;

  const translater = makeTranslator({ x: -left, y: -top });
  const scaler = makeScaler({ x: 1 / scaleX, y: 1 / scaleY });

  const transform = (position: Vector2d) => scaler(translater(position));

  return (
    <Layer
      x={left}
      y={top}
      scaleX={scaleX}
      scaleY={scaleY}
      onMouseDown={evt => props.onMouseDown(transform(positionOf(evt)))}
      onMouseMove={evt =>
        props.onMouseMove(evt.evt.buttons === 1, transform(positionOf(evt)))
      }
      onMouseUp={evt => props.onMouseUp(transform(positionOf(evt)))}
    >
      {props.children}
    </Layer>
  );
};

export default ResponsiveLayer;
