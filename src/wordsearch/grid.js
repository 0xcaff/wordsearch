// A grid is a data structure which stores and retrive points with a 2d
// coordinate system. The nodes are stored in a sparse 2d array.
export class ArrayGrid {
  constructor() {
    // A row major, sparse 2d array used to hold nodes in a 2d grid.
    this.data = [
      // [], [],
    ];

    this.maxCols = 0;

    this.positions = new Map();

    this.nodes = [];
  }

  // Create an instance from a 2D, row major, uniform column sized array.
  static fromArray(rows) {
    const grid = new ArrayGrid();

    grid.data = rows;
    grid.maxCols = rows.reduce((acc, val) => {
      if (val.length > acc) {
        return val.length;
      }

      return acc;
    }, 0);

    grid.data.forEach((row, rowIndex) =>
      row.forEach((item, colIndex) => {
        grid.positions.set(item, {x: colIndex, y: rowIndex})
        grid.nodes.push(item);
      })
    );

    return grid;
  }

  // If x or y are invalid, returns undefined.
  get(x, y) {
    if (y < 0 || y >= this.data.length) {
      // out of bounds
      return;
    }

    const row = this.data[y];
    if (x < 0 || x >= row.length) {
      // out of bounds
      return;
    }

    return row[x];
  }

  put(thing, x, y) {
    if (x < 0 || y < 0) {
      throw Error("Index out of bounds");
    }

    if (this.data.length <= y) {
      // not long enough, grow data
      this.data.length = y + 1;
    }

    if (!this.data[y]) {
      // need to create array
      this.data[y] = [];
    }

    const row = this.data[y];
    if (row.length <= x) {
      row.length = x + 1;

      if (this.maxCols < row.length) {
        this.maxCols = row.length;
      }
    }

    this.positions.set(thing, {x: x, y: y});
    row[y] = thing;
    this.nodes.push(thing);
  }

  // The number of rows this grid has.
  rows() {
    return this.data.length;
  }

  // The number of columns this grid has.
  columns() {
    return this.maxCols;
  }

  positionOf(item) {
    return this.positions.get(item);
  }

  shallowCopy() {
    // copy data
    const newThing = {...this};

    // copy behavior
    const proto = Object.getPrototypeOf(this);
    Object.setPrototypeOf(newThing, proto);

    return newThing;
  }
}
