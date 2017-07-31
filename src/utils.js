// Flattens annotations from the google cloud vision API into just an array of
// the discovered letters. The structure GCV assumes is incorrect. It assumes
// document while we need a grid.
export function getSymbols(parent, innerPropName = 'pages') {
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
    acc.concat(getSymbols(thing, nextInnerPropName)), []);
}

const innerPropNames = ['pages', 'blocks', 'paragraphs', 'words', 'symbols']; // , 'text'];

// Expands sel to the given coordinates and redraws the layer sel is on if
// needed.
export function expandSelection(sel, { x0, y0, x1, y1 }) {
  let changed = false;

  if (x0 === undefined) { x0 = sel.x() } else { sel.x(x0); changed = true };
  if (y0 === undefined) { y0 = sel.y() } else { sel.y(y0); changed = true };

  if (x0 !== undefined && x1 !== undefined) { sel.width(x1 - x0); changed = true };
  if (y0 !== undefined && y1 !== undefined) { sel.height(y1 - y0); changed = true };

  if (changed) {
    const layer = sel.getLayer();
    layer.batchDraw();
  }
}

export const withPosition = (inner) => evt => inner(getPosition(evt), evt);

export const getPosition = (evt) =>
  (evt.target || evt.currentTarget).getStage().getPointerPosition();

export const concatBounds = ({ minX, minY, maxX, maxY }, {x, y}) => ({
  minX: Math.min(minX, x),
  minY: Math.min(minY, y),
  maxX: Math.max(maxX, x),
  maxY: Math.max(maxY, y),
});

export const getUnboundedBounds = _ => ({
  minX: Infinity,
  minY: Infinity,
  maxX: -Infinity,
  maxY: -Infinity,
});

export const boundsOfVertices = (vertices) => vertices.reduce(
    (oldBounds, vert) => concatBounds(oldBounds, vert),
    getUnboundedBounds()
  );

export function dims(rect) {
  const x0 = rect.x();
  const y0 = rect.y();

  const x1 = x0 + rect.width();
  const y1 = y0 + rect.height();

  return {x0, x1, y0, y1};
}

export function scale({ x0, y0, x1, y1 }, scaleX, scaleY) {
  return {
    x0: x0 * scaleX,
    y0: y0 * scaleY,
    x1: x1 * scaleX,
    y1: y1 * scaleY,
  };
}

// Converts dims to a bounding box.
const dimsToBounds = ({ x0, y0, x1, y1 }) => ({
  minX: Math.min(x0, x1),
  minY: Math.min(y0, y1),
  maxX: Math.max(x0, x1),
  maxY: Math.max(y0, y1),
});

// Converts a konva rect into a rbush bounds.
export function boundsFromRect(area, scaleX, scaleY) {
  const dim = dims(area);
  const scaled = scale(dim, scaleX, scaleY);
  const bounds = dimsToBounds(scaled);

  return bounds;
}

// Comparse the bounds of two bounding rects returning:
// * < 1 if a is less than b
// * 0 if a is equal to b
// * > 1 if a is greater than b
//
// a is greater than b if a is further down or more to the right than b
export function compareBounds(a, b) {
  // TODO: fixme i'm broken

  // condense bounds into point
  const {x: ax, y: ay} = centerOfBounds(a);
  const {x: bx, y: by} = centerOfBounds(b);

  const dx = ax - bx;
  const dy = ay - by;

  const adx = Math.abs(dx);
  const ady = Math.abs(dy);

  if (adx > ady) {
    return dx;
  } else if (ady > adx) {
    return dy;
  } else {
    return 0;
  }
}

export function centerOfBounds({ minX, minY, maxX, maxY }) {
  return {
    x: (maxX - minX) / 2 + minX,
    y: (maxY - minY) / 2 + minY,
  };
}

// If thing is not in set, adds it otherwise removes it.
export function toggleInSet(set, thing) {
  if (set.has(thing)) {
    set.delete(thing);
  } else {
    set.add(thing);
  }
}

export function sizeOfBounds(bounds) {
  const { minX, minY, maxX, maxY } = bounds;
  return { width: maxX - minX, height: maxY - minY };
}

export function stddev(...values) {
  const m = mean(...values);
  const deviations = values.map(val => (val - m) * (val - m));
  const variance = mean(...deviations);
  const dev = Math.sqrt(variance);

  return { dev, mean: m };
}

export const mean = (...values) => values.reduce((acc, val) => acc + (val/values.length), 0);

function getKernelDensityEstimator(values, bandwidth, kernel = gaussianKernel) {
  return (x) => {
    const n = values.length;
    const h = bandwidth;

    const kernelSum = values.reduce((sum, xi) => {
      const kernelEvaled = kernel(x - xi, h);
      return sum + kernelEvaled;
    }, 0);

    return kernelSum / (n * h);
  };
}

export function findExtrema({
  f = required('f'),
  start = required('start'),
  end = required('end'),
  stepSize = required('stepSize'),
}) {
  const mins = [];
  const maxes = [];

  const evaledAtStep = [];

  const stepCount = Math.round((end - start) / stepSize);

  // We base this look on stepCount because of float rounding errors.
  for (let x = start, step = 0; step <= stepCount; x += stepSize, step++) {
    evaledAtStep[step] = f(x);
  }

  for (let step = 0; step < evaledAtStep.length; step++) {
    const previous = getPossiblyUnbounded(evaledAtStep, step - 1);
    const current = evaledAtStep[step];
    const next = getPossiblyUnbounded(evaledAtStep, step + 1);

    if (current > previous && current > next) {
      maxes.push(start + step * stepSize);
    }

    if (current < previous && current < next) {
      mins.push(start + step * stepSize);
    }
  }

  return { mins, maxes };
}

export function estimateExtrema({ values, bandwidth }) {
  const extra = bandwidth * 8;
  const min = Math.min(...values);
  const max = Math.max(...values);

  const kde = getKernelDensityEstimator(values, bandwidth);

  const start = min - extra;
  const end = max + extra;
  const steps = 1000;

  return findExtrema({
    f: kde,
    start,
    end,

    // stepSize: deviation / (end - start),
    stepSize: bandwidth,
  });
}

const exp = (to) => Math.E ** to;
const gaussianKernel = (x, h) => exp(-(x ** 2) / (2 * h ** 2));

// Gets elements from an array returning undefined if i is out of the array bounds.
const getPossiblyUnbounded = (array, i) => i >= 0 && i < array.length ? array[i] : undefined;

const required = (name) => { throw new TypeError(`${name} is a required parameter`) };
