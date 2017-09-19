import { CharNode } from './graph';
import { ArrayGrid, connectGrid, Directions } from './grid';

export function solve({ words, rows }, findMatches) {
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

  return matches;
}
