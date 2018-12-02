import { Vector2d } from "konva";
import Flatbush from "flatbush";
import { boundingPolyToBox } from "./googleCloudVision";
import { Symbol } from "./googleCloudVisionTypes";

export const getRows = (
  topLeft: Vector2d,
  bottomRight: Vector2d,
  rows: number,
  cols: number,
  symbols: Symbol[]
): string[] => {
  const index = new Flatbush(symbols.length);

  symbols
    .map(symbol => boundingPolyToBox(symbol.boundingBox))
    .forEach(box => index.add(box.minX, box.minY, box.maxX, box.maxY));

  index.finish();

  const width = bottomRight.x - topLeft.x;
  const colWidth = width / cols;

  const height = bottomRight.y - topLeft.y;
  const rowHeight = height / rows;

  const maxDistance = Math.min(colWidth, rowHeight) / 2;

  const computedRows = [];
  for (let rowIdx = 0; rowIdx < rows; rowIdx++) {
    const row = [];

    for (let colIdx = 0; colIdx < cols; colIdx++) {
      const neighbors = index.neighbors(
        topLeft.x + rowIdx * colWidth,
        topLeft.y + colIdx * rowHeight,
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
