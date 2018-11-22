export interface PuzzleWithId extends PuzzleData {
  id: string;
}

export interface PuzzleData {
  rows: string[];
  words: string[];
}

export interface Database {
  getPuzzle(id: string): Promise<PuzzleWithId | null>;
  newPuzzle(data: PuzzleData): Promise<PuzzleWithId>;
}
