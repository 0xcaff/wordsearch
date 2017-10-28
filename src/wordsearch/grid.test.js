import { CharNode, ArrayGrid } from './';
import { rows } from './data/states';

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
  expect(grid.get(0, 0).value).toBe('T');
  expect(grid.get(0, 32).value).toBe('V');
  expect(grid.get(32, 0).value).toBe('S');
  expect(grid.get(32, 32).value).toBe('Z');
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
