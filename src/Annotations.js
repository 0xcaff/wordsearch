import React, { Component } from 'react';
import Konva from 'konva';

import {
  withPosition, expandSelection, boundsFromRect, toggleInSet
} from './utils';

import './Annotations.css';

const COLORS = {
  SELECTED: 'orange',
  HOVERED: 'red',
  DEFAULT: 'black',
  SELECTION: '#222',
};

// TODO: Show tooltip with highlighted character.

// TODO: The selection doesn't work for some puzzles. Investigate.

// TODO: Make the UI Look Nice:
// * hide bounding boxes
// * put the stuff here in a pop up dialog
// * Put the area selector in a box
// * Loading indicator.

// TODO: Think about making the assumption the area between grid rows and
// columns are equal.

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
  // updating a view after changing a value.
  elements = null;

  // The Konva.Layer which holds the views for the annotation elements. It's
  // kept here for easy batchDraws.
  annotations = null;

  // This is the processed data returned from GCV of each character and it's
  // bounding box.
  data = null;

  // An rbush R-Tree for finding things which are inside or intersect a box.
  // Also used for fast nearest neighbor lookups.
  tree = null;

  // The Konva.Layer which holds the calculated grid of puzzle.
  gridOverlayLayer = null;

  // We rarely update this component because drawing is handled by konva and
  // updates happen imperatively.
  shouldComponentUpdate(nextProps) {
    return this.props.image !== nextProps.image;
  }

  componentDidMount() {
    this.stage = new Konva.Stage({ container: this.domNode });

    this.handleProps(this.props);
  }

  // Called when new props are received, including after the initial render.
  handleProps(props) {
    const { image, tree, annotations: rawAnnotations } = props;
    this.data = rawAnnotations;
    this.tree = tree;

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
    stage.removeChildren();
    stage.width(width);
    stage.height(height);

    // (re)?create layers

    // image layer
    const imageLayer = new Konva.FastLayer({ scaleX, scaleY });
    const imageElement = new Konva.Image({ image });
    imageLayer.add(imageElement);
    stage.add(imageLayer);

    this.gridOverlayLayer = new Konva.FastLayer({ scaleX, scaleY });
    stage.add(this.gridOverlayLayer);

    // selection layer (the dashed box is goes here)
    const selectionLayer = new Konva.FastLayer();
    this.initSelectionLayer(selectionLayer, scaleX, scaleY);
    stage.add(selectionLayer);

    // annotation layer (colorful bounding boxes go here)
    const annotationsLayer = this.annotations = new Konva.Layer({ scaleX, scaleY });
    this.elements = new Map();
    this.createAnnotations();
    stage.add(annotationsLayer);
  }

  initSelectionLayer(layer, scaleX, scaleY) {
    const { tree } = this;
    const selected = this.selected;

    const area = new Konva.Rect({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      stroke: COLORS.SELECTION,
      dash: [10, 10],

      // TODO: use a dash offset to animate this
    });

    layer.add(area);

    const stage = this.stage;

    // attach listeners to stage so we receive all mouse events, (even consumed
    // ones).
    stage.on('contentMousedown', withPosition(({x, y}) => {
      expandSelection(area, {x0: x, y0: y, x1: x, y1: y});
    }));

    stage.on('contentMousemove', withPosition(({x, y}, {evt}) => {
      evt.buttons === 1 && expandSelection(area, {x1: x, y1: y});
    }));

    stage.on('contentMouseup', withPosition(({x, y}, {evt}) => {
      expandSelection(area, {x1: x, y1: y});

      // TODO: the selection doesn't work with images much larger than the frame

      // add contained nodes to selection
      const contained = tree.search(boundsFromRect(area, 1 / scaleX, 1 / scaleY));

      // hide selection area
      area.width(0);
      area.height(0);

      // inverse selection with ctrl, otherwise replace
      if (!evt.ctrlKey) {
        selected.clear();
      }

      contained.forEach(({ node }) => {
        toggleInSet(selected, node);
      });

      // TODO: Expose Selected

      this.updateAllNodes();
    }));
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

  // update all nodes
  updateAllNodes() {
    const { selected } = this;
    const { onSelectedChanged } = this.props;

    this.data.forEach(node => this.updateNode(node));
    this.annotations.batchDraw();

    onSelectedChanged(selected);
  }

  componentWillReceiveProps(nextProps) {
    this.handleProps(nextProps);
  }

  componentWillUnmount() {
    this.stage.destroy();
  }

  render() {
    return (
      <div className='Annotations'>
        <div
          ref={elem => this.domNode = elem}
          className='canvases' />
      </div>
    );
  }
}
