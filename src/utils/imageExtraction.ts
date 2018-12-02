import Flatbush from "flatbush";
import { Vector2d } from "konva";
import { SymbolWithBoundingBox } from "./googleCloudVision";

import memoize from "fast-memoize";
import {
  boundingBoxHeight,
  boundingBoxWidth,
  boundingPoints,
  center,
  normalizeCorners
} from "./geom";
import { sortBy } from "./sort";

const getFlatbush = memoize((symbols: SymbolWithBoundingBox[]) => {
  const index = new Flatbush(symbols.length);

  symbols.forEach(symbol =>
    index.add(
      symbol.bounds.minX,
      symbol.bounds.minY,
      symbol.bounds.maxX,
      symbol.bounds.maxY
    )
  );

  index.finish();

  return index;
});

export const getRows = (
  pointA: Vector2d,
  pointB: Vector2d,
  rows: number,
  cols: number,
  symbols: SymbolWithBoundingBox[]
): string[] => {
  const index = getFlatbush(symbols);
  const { topLeft, bottomRight } = normalizeCorners(pointA, pointB);

  const width = bottomRight.x - topLeft.x;
  const colWidth = width / (cols - 1);

  const height = bottomRight.y - topLeft.y;
  const rowHeight = height / (rows - 1);

  const maxDistance = Math.min(colWidth, rowHeight) / 2;

  const computedRows = [];
  for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
    const row = [];

    for (let colIdx = 0; colIdx < cols; colIdx++) {
      const neighbors = index.neighbors(
        topLeft.x + colIdx * colWidth,
        topLeft.y + rowIdx * rowHeight,
        1,
        maxDistance
      );

      if (neighbors.length) {
        const [neighborIdx] = neighbors;
        row.push(symbols[neighborIdx].text);
      } else {
        row.push(" ");
      }
    }

    computedRows.push(row.join(""));
  }

  return computedRows;
};

export const getWord = (
  pointA: Vector2d,
  pointB: Vector2d,
  symbols: SymbolWithBoundingBox[]
): string => {
  const index = getFlatbush(symbols);
  const { topLeft, bottomRight } = normalizeCorners(pointA, pointB);

  const neighborIndices = index.search(
    topLeft.x,
    topLeft.y,
    bottomRight.x,
    bottomRight.y
  );

  const neighbors = neighborIndices
    .map(neighborIdx => symbols[neighborIdx])
    .map(symbol => ({ symbol, center: center(symbol.bounds) }));

  const bounds = boundingPoints(neighbors.map(n => n.center));
  const width = boundingBoxWidth(bounds);
  const height = boundingBoxHeight(bounds);

  const comparator =
    width >= height
      ? sortBy<{ center: Vector2d }>(t => -t.center.x)
      : sortBy<{ center: Vector2d }>(t => t.center.y);

  neighbors.sort(comparator);

  return neighbors.map(neighbor => neighbor.symbol.text).join("");
};
