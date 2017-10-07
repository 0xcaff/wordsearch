import { findMatches as defaultFindMatches } from './search/force';
import { ArrayGrid, Directions, CharNode } from './';

const buildGrid = (rows) => {
  const nodeRows = rows.map(row =>
    row
      .split("")
      .map(khar => new CharNode(khar))
  );

  const grid = ArrayGrid.fromArray(nodeRows);

  return grid;
};

export function solve(
  rows,
  words,
  allowedDirections = Directions,
  findMatches = defaultFindMatches,
) {
  const grid = buildGrid(rows);

  // solve
  const matches = findMatches(words, grid, allowedDirections);

  return { matches, grid };
}
