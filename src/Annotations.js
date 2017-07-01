import React, { Component } from 'react';
import { FastLayer, Layer, Stage, Image, Line, Rect } from 'react-konva';

import './Annotations.css';

// Renders results from a Google Cloud Vision text annotation query.
export default class Annotations extends Component {
  state = {
    x0: 0,
    y0: 0,
    x1: 0,
    y1: 0,
  };

  render() {
    const { image, annotations } = this.props;
    const { x0, y0, x1, y1 } = this.state;

    const { width: imageWidth, height: imageHeight } = image;

    const width = Math.min(800, imageWidth);
    const height = (imageHeight / imageWidth) * width;

    const { fullTextAnnotation } = annotations;
    const flatAnnotations = flattenAnnotations(fullTextAnnotation);

    // TODO: Select Grid Region
    // TODO: Highlight Intersected (using Rbush)

    // TODO: Guess Grid
    // TODO: Make the UI Look Nice:
    // * Put the area selector in a box
    // * Loading indicator.

    // Events need to be on the topmost layer.
    // Events should still propogate to bounding boxes .

    return (
      <Stage
        className='Annotations'
        width={width}
        height={height}
        onContentMouseDown={ pos(({x, y}) =>
          this.setState({x0: x, y0: y, x1: x, y1: y})
        ) }
        onContentMouseMove={ pos(({x, y}, {evt}) =>
          evt.buttons === 1 && this.setState({x1: x, y1: y})
        ) }
        onContentMouseUp={ pos(({x, y}) => this.setState({x1: x, y1: y}) )}>

        <FastLayer
          scaleX={width / imageWidth}
          scaleY={height / imageHeight}>

          <Image
            image={image} />
        </FastLayer>

        <FastLayer>
          <Rect
            x={x0}
            y={y0}
            width={x1 - x0}
            height={y1 - y0}
            stroke='black'
            dash={[10, 10]} />
        </FastLayer>

        <Layer
          scaleX={width / imageWidth}
          scaleY={height / imageHeight}>
          { flatAnnotations.map(
              ({ property, boundingBox, text }, index) =>
                <Line
                  key={index}
                  points={boundingBox.vertices.reduce((acc, {x, y}) => acc.concat(x, y), [])}
                  closed={true}
                  stroke={property.color ? property.color : 'black'}
                  onMouseEnter={_ => {
                    property.color = "red";
                    // this.forceUpdate();
                  }}
                  onMouseLeave={_ => {
                    property.color = "black"
                    // this.forceUpdate()
                  }} />
          ) }
        </Layer>
      </Stage>
    );
  }
}

// Flattens the annotations into an array of just the discovered letters. We do
// this because we don't care about any inferred document structure.
export function flattenAnnotations(parent, innerPropName = 'pages') {
  const things = parent[innerPropName];

  // find next inner prop
  const nextPropIndex = innerPropNames.indexOf(innerPropName) + 1;

  if (nextPropIndex >= innerPropNames.length) {
    // things are leaf nodes
    return things;
  }

  const nextInnerPropName = innerPropNames[nextPropIndex];

  // things aren't leaf nodes, traverse further down
  return things.reduce((acc, thing) =>
    acc.concat(flattenAnnotations(thing, nextInnerPropName)), []);
}

const innerPropNames = ['pages', 'blocks', 'paragraphs', 'words', 'symbols']; // , 'text'];

const pos = (inner) => evt => inner(getPosition(evt), evt);
const getPosition = (evt) => (evt.target || evt.currentTarget).getStage().getPointerPosition();
