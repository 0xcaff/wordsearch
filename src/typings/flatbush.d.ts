declare module "flatbush" {
  class Flatbush {
    constructor(numItems: number, nodeSize?: number);

    add(minX: number, minY: number, maxX: number, maxY: number): void;

    finish(): void;

    search(
      minX: number,
      minY: number,
      maxX: number,
      maxY: number,
      filterFn?: (idx: number) => any
    ): number[];

    neighbors(
      x: number,
      y: number,
      maxResults?: number,
      maxDistance?: number,
      filterFn?: (idx: number) => any
    ): number[];
  }

  export default Flatbush;
}
