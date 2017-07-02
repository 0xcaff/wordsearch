import React, { Component } from 'react';
import Konva from 'konva';
import rbush from 'rbush';

import './Annotations.css';

const COLORS = {
  SELECTED: 'orange',
  HOVERED: 'red',
  DEFAULT: 'black',
  SELECTION: '#222',
};

// TODO: Updating the graph puts it in an inconsistent state

// TODO: Devise an algorithm to put the puzzle on a grid.

// TODO: Devise an algoritm to find words given a list of nodes.

// TODO: Make the UI Look Nice:
// * Put the area selector in a box
// * Loading indicator.

// Renders results from a Google Cloud Vision text annotation query. We are
// using konva to render this view because React was choking on reconciliation
// when the selected nodes were changed. I was having this problem previously
// with the wordsearch Grid and solved it by using an overlay.
//
// This view renders an image with the Google Cloud Vision bounding boxes and
// allows the user to select the puzzle and words.
export default class Annotations extends Component {
  constructor(props) {
    super(props);

    this.handleProps = this.handleProps.bind(this)
  }

  // The konva stage which we will be rendering to. This is populated in
  // componentDidMount and is kept for the lifetime of the object.
  stage = null;

  // A set of nodes of which are currently selected. The bounding boxes they
  // correspond to will be displayed differently and this data will be used in
  // the grid building and output process. Nodes are added to this set by
  // Ctrl + Clicking / Ctrl + Click + Selecting.
  selected = null;

  // A mapping of nodes (data) to Lines (view). This allows for surgically
  // updating a view after changing a value .
  elements = null;

  // The Konva.Layer which holds the views for the annotation elements. It's
  // kept here for easy batchDraws.
  annotations = null;

  // This is the processed data returned from GCV of each character and it's
  // bounding box.
  data = null;

  // We rarely update this component because drawing is handled by konva.
  shouldComponentUpdate(nextProps) {
    return this.props.image !== nextProps.image;
  }

  componentDidMount() {
    this.stage = new Konva.Stage({container: this.domNode});

    this.handleProps(this.props);
  }

  // Called when new props are received, including after the initial render.
  handleProps(props) {
    const { image, annotations: rawAnnotations } = props;

    // compute dimensions of canvas based on image.
    const { width: imageWidth, height: imageHeight } = image;
    const width = Math.min(800, imageWidth);
    const height = (imageHeight / imageWidth) * width;

    // applying these as multipliers to the image size will result in the canvas
    // size
    const scaleX = width / imageWidth;
    const scaleY = height / imageHeight;

    this.selected = new Set();

    // setup stage
    const stage = this.stage;
    stage.clear();
    stage.width(width);
    stage.height(height);

    // wrangle data
    this.data = flatten(rawAnnotations['fullTextAnnotation']);

    // (re)?create layers

    // image layer
    const imageLayer = new Konva.FastLayer({scaleX: scaleX, scaleY: scaleY});
    const imageElement = new Konva.Image({image: image});
    imageLayer.add(imageElement);
    stage.add(imageLayer);

    // selection layer (the dashed box is goes here)
    const selectionLayer = new Konva.FastLayer();
    this.initSelectionLayer(selectionLayer, scaleX, scaleY);
    stage.add(selectionLayer);

    // annotation layer (colorful bounding boxes go here)
    const annotationsLayer = this.annotations = new Konva.Layer({scaleX: scaleX, scaleY: scaleY});
    this.elements = new Map();
    this.createAnnotations();
    stage.add(annotationsLayer);
  }

  initSelectionLayer(layer, scaleX, scaleY) {
    const tree = Annotations.buildRTree(this.data);
    const selected = this.selected;

    const area = new Konva.Rect({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      stroke: COLORS.SELECTION,
      dash: [10, 10],
    });

    layer.add(area);

    const stage = this.stage;

    // attach listeners to stage so we receive all click events, (even consumed
    // ones).
    stage.on('contentMousedown', pos(({x, y}) => {
      select(area, {x0: x, y0: y, x1: x, y1: y});
    }));

    stage.on('contentMousemove', pos(({x, y}, {evt}) => {
      evt.buttons === 1 && select(area, {x1: x, y1: y});
    }));

    stage.on('contentMouseup', pos(({x, y}, {evt}) => {
      select(area, {x1: x, y1: y});

      // add contained nodes to selection
      const contained = tree.search(boundsRect(area, 1 / scaleX, 1 / scaleY));

      // hide selection area
      area.width(0);
      area.height(0);

      // inverse selection with ctrl, otherwise replace
      if (!evt.ctrlKey) {
        selected.clear();
      }

      contained.forEach(({node}) => {
        toggle(selected, node);
      });

      // update all nodes
      this.data.map(node => this.updateNode(node));

      this.annotations.batchDraw();
    }));
  }

  // Creates an rbush R-Tree for fast lookups of things in a region.
  static buildRTree(annotations) {
    const tree = rbush();

    const leaves = annotations.map(node => {
      const { boundingBox } = node;

      // the bounding box may not be aligned along the xy plane, so convert it
      // ot be sure.
      const bbox = bounds(boundingBox.vertices);

      const leaf = { node: node };
      Object.assign(leaf, bbox);

      return leaf;
    });

    tree.load(leaves);
    return tree;
  }

  createAnnotations() {
    const layer = this.annotations;

    const elements = this.data.map(
      node => {
        const { boundingBox: bbox } = node;

        const points = bbox.vertices.reduce((acc, {x, y}) => acc.concat(x, y), []);
        const view = new Konva.Line({
          points: points,
          closed: true,
          stroke: COLORS.DEFAULT,
        });

        this.elements.set(node, view);

        view.on('mouseenter', _ => {
          node.hovered = true;
          this.updateNode(node);
          layer.batchDraw();
        });

        view.on('mouseleave', _ => {
          node.hovered = false;
          this.updateNode(node);
          layer.batchDraw();
        });

        return view;
      });

    layer.add(...elements);
  }

  // given a node finds its view and re-renders it
  updateNode(node) {
    const view = this.elements.get(node);
    if (!view) {
      throw new Error("updateNode called on a non-initialized node");
    }

    if (node.hovered) {
      view.stroke(COLORS.HOVERED);
    } else {
      view.stroke(this.selected.has(node) ? COLORS.SELECTED : COLORS.DEFAULT);
    }
  }

  componentWillReceiveProps(nextProps) {
    this.handleProps(nextProps);
  }

  componentWillUnmount() {
    this.stage.destroy();
  }

  render() {
    return (
      <div
        ref={elem => this.domNode = elem}
        className='Annotations' />
    );
  }
}

// Flattens the annotations into an array of just the discovered letters. We do
// this because we don't care about any inferred document structure.
export function flatten(parent, innerPropName = 'pages') {
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
    acc.concat(flatten(thing, nextInnerPropName)), []);
}

const innerPropNames = ['pages', 'blocks', 'paragraphs', 'words', 'symbols']; // , 'text'];

// Given a Rect, expands sets the given coordinates if supplied.
function select(sel, {x0, y0, x1, y1}) {
  let changed = false;
  if (x0 !== undefined) {
    sel.x(x0);
    changed = true;
  } else {
    x0 = sel.x();
  }

  if (y0 !== undefined) {
    sel.y(y0);
    changed = true;
  } else {
    y0 = sel.y();
  }

  if (x1 !== undefined && x0 !== undefined) {
    sel.width(x1 - x0);
    changed = true;
  }

  if (y1 !== undefined && y0 !== undefined) {
    sel.height(y1 - y0);
    changed = true;
  }

  if (changed) {
    const layer = sel.getLayer();
    layer.batchDraw();
  }
}

const pos = (inner) => evt => inner(getPosition(evt), evt);
const getPosition = (evt) => (evt.target || evt.currentTarget).getStage().getPointerPosition();

export const bounds = (vertices) =>
  vertices.reduce(({ minX, minY, maxX, maxY }, {x, y}) => ({
    minX: Math.min(minX, x),
    minY: Math.min(minY, y),
    maxX: Math.max(maxX, x),
    maxY: Math.max(maxY, y),
  }), {
    minX: Infinity,
    minY: Infinity,
    maxX: -Infinity,
    maxY: -Infinity,
  });

// Converts a konva Rect into an rbrush bounds object with scaling factors.
function boundsRect(rect, scaleX, scaleY) {
  const x0 = rect.x() * scaleX;
  const y0 = rect.y() * scaleY;

  const width = rect.width() * scaleX;
  const height = rect.height() * scaleY;

  const x1 = x0 + width;
  const y1 = y0 + height;

  return {
    minX: Math.min(x0, x1),
    minY: Math.min(y0, y1),
    maxX: Math.max(x0, x1),
    maxY: Math.max(y0, y1),
  };
};

// If thing is not in set, adds it otherwise removes it.
function toggle(set, thing) {
  if (set.has(thing)) {
    set.delete(thing);
  } else {
    set.add(thing);
  }
}
