import React from "react";
import { Layer } from "react-konva";

interface Props {
  dims: Dims;
  aspectRatio: Dims;
  children: React.ReactNode;
}

interface Dims {
  width: number;
  height: number;
}

const ResponsiveLayer = (props: Props) => {
  const widthByHeight =
    (props.aspectRatio.width / props.aspectRatio.height) * props.dims.height;

  const heightByWidth =
    (props.aspectRatio.height / props.aspectRatio.width) * props.dims.width;

  const width = Math.min(widthByHeight, props.dims.width);
  const height = Math.min(heightByWidth, props.dims.height);

  const left = (props.dims.width - width) / 2;
  const top = (props.dims.height - height) / 2;

  return (
    <Layer
      x={left}
      y={top}
      scaleX={width / props.aspectRatio.width}
      scaleY={height / props.aspectRatio.height}
    >
      {props.children}
    </Layer>
  );
};

export default ResponsiveLayer;
