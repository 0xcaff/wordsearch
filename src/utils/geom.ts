import { Vector2d } from "konva";

export interface BoundingBox {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

export const center = (box: BoundingBox): Vector2d => ({
  x: box.minX + (box.maxX - box.minX) / 2,
  y: box.minY + (box.maxY - box.minY) / 2
});

export const boundingPoints = (vertices: Vector2d[]): BoundingBox =>
  vertices.reduce(
    (previous, current) => ({
      minX: Math.min(current.x, previous.minX),
      minY: Math.min(current.y, previous.minY),
      maxX: Math.max(current.x, previous.maxX),
      maxY: Math.max(current.y, previous.maxY)
    }),
    {
      minX: Infinity,
      minY: Infinity,
      maxY: -Infinity,
      maxX: -Infinity
    }
  );

export const boundingBoxWidth = (box: BoundingBox) => box.maxX - box.minX;

export const boundingBoxHeight = (box: BoundingBox) => box.maxY - box.minY;

export const normalizeCorners = (a: Vector2d, b: Vector2d) => ({
  topLeft: { x: Math.min(a.x, b.x), y: Math.min(a.y, b.y) },
  bottomRight: { x: Math.max(a.x, b.x), y: Math.max(a.y, b.y) }
});
