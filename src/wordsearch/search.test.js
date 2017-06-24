import { connectGrid, findMatches, Directions, CharNode, ArrayGrid } from './search';
import { rows } from './data/states';

describe('ArrayGrid', () => {
  let grid;

  beforeEach(() => {
    const nodeRows = rows.map(row =>
      row
        .split("")
        .map(khar => new CharNode(khar))
    );
    expect(nodeRows).toHaveLength(rows.length);

    grid = ArrayGrid.fromArray(nodeRows);
  });

  it('should be the correct shape', () => {
    expect(grid.rows()).toBe(rows.length);
    expect(grid.columns()).toBe(rows[0].length);
  });

  it('should have its origin at the top left', () => {
    // check four corners
    expect(grid.get(0, 0).khar).toBe('T');
    expect(grid.get(0, 32).khar).toBe('V');
    expect(grid.get(32, 0).khar).toBe('S');
    expect(grid.get(32, 32).khar).toBe('Z');
  });

  it('should allow fast lookups', () => {
    const node = grid.get(10, 10);
    expect(grid.positionOf(node)).toMatchObject({x: 10, y: 10});
  });

  it('should shallow copy', () => {
    const copiedGrid = grid.shallowCopy();

    expect(copiedGrid).not.toBe(grid);
    expect(copiedGrid.data).toBe(grid.data);
    expect(copiedGrid.columns()).toBe(grid.columns());
  });
});

it('should find all the words in the puzzle', () => {
});

describe('solver', () => {
  ['states', 'dog', 'artists', 'valentine'].forEach(name => {
    const puzzle = require(`./data/${name}`);

    it(`should solve the ${name} puzzle`, () => {
      solve(puzzle);
    });
  });
});

function solve({words, rows}) {
  // build graph
  const nodeRows = rows.map(row =>
    row
      .split("")
      .map(khar => new CharNode(khar))
  );

  // build overlay grid
  const grid = ArrayGrid.fromArray(nodeRows);
  const nodes = connectGrid(grid);

  // solve
  const matches = findMatches(words, nodes, new Set(Object.keys(Directions)));
  expect(Object.keys(matches)).toHaveLength(words.length);
}
