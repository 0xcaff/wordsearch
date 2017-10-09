import React, { Component } from 'react';
import Konva from 'konva';

import { withPosition, boundsFromRect, toggleInSet, scale } from './utils';

import './Annotations.css';

const COLORS = {
  SELECTED: 'orange',
  HOVERED: 'red',
  DEFAULT: 'black',
  SELECTION: '#222',
};

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

    this.onResize = this.onResize.bind(this);
    this.handleProps = this.handleProps.bind(this);
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

    window.addEventListener('resize', this.onResize);
    this.handleProps(this.props, {});
    this.onResize();
  }

  onResize() {
    const { image: { width: imageWidth, height: imageHeight } } = this.props;

    const parentSize =
        [window.innerWidth, window.innerHeight]
          .map(d => d * 0.90)
          .map(Math.floor)
          .reduce((a, b) => Math.min(a, b), Infinity);

    const width = Math.min(imageWidth, parentSize);
    const height = (imageHeight / imageWidth) * width;

    // applying these as multipliers to the image size will result in the canvas
    // size
    const scaleX = width / imageWidth;
    const scaleY = height / imageHeight;

    const { stage } = this;
    stage.width(width);
    stage.height(height);
    stage.scaleX(scaleX);
    stage.scaleY(scaleY);

    Object.assign(this, { scaleX, scaleY });
  }

  // Called when new props are received, including after the initial render.
  handleProps(props, oldProps) {
    const {
      image,
      tree,
      annotations: rawAnnotations,
      selected = new Set(),
      overlayShapes = [],
    } = props;

    const {
      image: oldImage,
      tree: oldTree,
      annotations: oldAnnotations,
      selected: oldSelected,
      overlayShapes: oldOverlayShapes,
    } = oldProps;

    if (rawAnnotations !== oldAnnotations && tree !== oldTree && image !== oldImage) {
      Object.assign(this, { data: rawAnnotations, tree, selected });

      // compute dimensions of canvas based on image.
      const { width: imageWidth, height: imageHeight } = image;

      // setup stage
      const stage = this.stage;
      stage.removeChildren();
      stage.width(imageWidth);
      stage.height(imageHeight);

      // (re)?create layers

      // image layer
      const imageLayer = new Konva.FastLayer();
      const imageElement = new Konva.Image({ image });
      imageLayer.add(imageElement);
      stage.add(imageLayer);

      this.gridOverlayLayer = new Konva.FastLayer();
      stage.add(this.gridOverlayLayer);

      // selection layer (the dashed box is goes here)
      const selectionLayer = new Konva.FastLayer();
      this.initSelectionLayer(selectionLayer);
      stage.add(selectionLayer);

      // annotation layer (colorful bounding boxes go here)
      const annotationsLayer = this.annotations = new Konva.Layer();
      this.elements = new Map();
      this.createAnnotations();
      stage.add(annotationsLayer);
    }

    if (overlayShapes !== oldOverlayShapes) {
      const layer = this.gridOverlayLayer;
      overlayShapes.forEach(shape => layer.add(shape));
      layer.batchDraw();
    }

    if (selected !== oldSelected) {
      this.selected = selected;
      this.updateAllNodes();
    }
  }

  initSelectionLayer(layer) {
    const { tree, stage } = this;

    const area = new Konva.Rect({
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      stroke: COLORS.SELECTION,
      dash: [10, 10],
      opacity: 0.85,
    });

    layer.add(area);

    // attach listeners to stage so we receive all mouse events, (even consumed
    // ones).
    stage.on('contentMousedown contentTouchstart', withPosition(({ x, y }, { evt }) => {
      evt.preventDefault();

      const { scaleX, scaleY } = this;
      const scaled = scale({ x0: x, y0: y, x1: x, y1: y }, 1 / scaleX, 1 / scaleY);
      expandSelection(area, scaled);
    }));

    stage.on('contentMousemove contentTouchmove', withPosition(({ x, y }, { evt }) => {
      evt.preventDefault();

      const { scaleX, scaleY } = this;
      const isActive = evt.buttons === 1 || (evt.touches && evt.touches.length);
      if (isActive) {
        const scaled = scale({ x1: x, y1: y }, 1 / scaleX, 1 / scaleY);
        expandSelection(area, scaled);
      }
    }));

    stage.on('contentMouseup contentTouchend', withPosition(({ x, y }, { evt }) => {
      evt.preventDefault();
      const { selected, scaleX, scaleY } = this;

      const scaled = scale({ x1: x, y1: y }, 1 / scaleX, 1 / scaleY);
      expandSelection(area, scaled);

      // add contained nodes to selection
      const contained = tree.search(boundsFromRect(area, 1, 1));

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
          opacity: 0.3,
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
      const isSelected = this.selected.has(node);
      view.stroke(isSelected ? COLORS.SELECTED : COLORS.DEFAULT);
      view.opacity(isSelected ? 1 : 0.3);
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
    this.handleProps(nextProps, this.props);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.onResize);
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

// Expands sel to the given coordinates and redraws the layer sel is on if
// needed.
function expandSelection(center, { x0, y0, x1, y1 }) {
  let changed = false;

  if (x0 === undefined) { x0 = center.x() } else { center.x(x0); changed = true };
  if (y0 === undefined) { y0 = center.y() } else { center.y(y0); changed = true };

  if (x0 !== undefined && x1 !== undefined) { center.width(x1 - x0); changed = true };
  if (y0 !== undefined && y1 !== undefined) { center.height(y1 - y0); changed = true };

  const layer = center.getLayer();
  if (changed) {
    layer.batchDraw();
  }
}
