import { Node } from './graph';

// A node in a standard character-based word search.
export class CharNode extends Node {
  constructor(khar) {
    super();

    // The char that this node repersents.
    this.khar = khar;

    // An array of matches which this node is a part of. Each match will hold
    // the other nodes which make up the match and some data about the match.
    this.partOf = [];
  }

  // A simple case insensitive between this and the other node's khar.
  matches(otherKhar) {
    return this.khar.toUpperCase() === otherKhar.toUpperCase();
  }
}

// A grid is a data structure which stores and retrive points with a 2d
// coordinate system. It's simply an overlay over top of the graph to make
// accessing nodes easier. An ArrayGrid is a Grid where data is stored in a
// sparse 2d array.
export class ArrayGrid {
  constructor() {
    // A row major, sparse 2d array used to hold nodes in a 2d grid.
    this.data = [
      // [], [],
    ];

    this.maxCols = 0;

    this.positions = new Map();
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
      row.forEach((item, colIndex) =>
        grid.positions.set(item, {x: colIndex, y: rowIndex}))
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

export const Directions = {
  "NW": {x: -1, y:  1}, // Top Left
  "N":  {x:  0, y:  1}, // Top Center
  "NE": {x:  1, y:  1}, // Top Right
  "E":  {x:  1, y:  0}, // Right Center
  "SE": {x:  1, y: -1}, // Bottom Right
  "S":  {x:  0, y: -1}, // Bottom Center
  "SW": {x: -1, y: -1}, // Bottom Left
  "W":  {x: -1, y:  0}, // Left Center
};

// For each node in the grid, connects to adjecent nodes, labeling connections.
export function connectGrid(grid) {
  const nodes = [];

  const rows = grid.rows();
  const cols = grid.columns();

  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      const node = grid.get(x, y);
      if (!node) {
        // not a valid node, skip it
        continue
      }

      // valid node, connect adjacent
      for (const [key, direction] of Object.entries(Directions)) {
        const otherNode = grid.get(x + direction.x, y + direction.y);
        if (!otherNode) {
          continue;
        }

        node.connectTo(otherNode, key);
      }

      nodes.push(node);
    }
  }

  return nodes;
}

// The worst case complexity of this algorithm is O(n * w * l) where nodes is the
// number of nodes in the graph, w is the number of words we are searching for
// and l is the average length of the word we are searching for.
export function findMatches(words, nodes, allowedEdges) {
  const matches = {
    // word: [
    //     [nodes],
    //     [nodes],
    // ],
  };

  // travarse graph once for each word
  for (const word of words) {
    // look at every direction of every node
    for (const node of nodes) {
      const potentialDirections = Object.entries(node.edges);
  
      for (const [directionName, ] of potentialDirections) {
        if (!allowedEdges.has(directionName)) {
          // not allowed to traverse this edge, ignore it
          continue;
        }

        const discoveredWord = [];
  
        // loop over the graph and the word and compare
        for (
          let index = 0, currentNode = node;
          index < word.length;
          index++, currentNode = currentNode.edges[directionName]
        ) {
          // check whether this node continues the sequence
          if (!currentNode || !currentNode.matches(word[index])) {
            // match failed, try next
            break;
          }
  
          // it matches, add to discovered
          discoveredWord.push(currentNode);
       }
  
        // we can be here in three possible states:
        // * the word length is zero
        // * there wasn't a match
        // * a complete match was found
  
        if (word.length <= 0 || word.length !== discoveredWord.length) {
          // the word length is zero or there wasn't a match
          continue
        }
  
        // a complete match was found, record match
        if (!matches[word]) {
          matches[word] = [];
        }
  
        const discoveredWordArray = [discoveredWord];
        matches[word] = matches[word].concat(discoveredWordArray);
  
        // add to every node in the word for easy access
        for (const node of discoveredWord) {
          node.partOf = node.partOf.concat(discoveredWordArray);
        }
      }
    }
  }

  return matches;
};

