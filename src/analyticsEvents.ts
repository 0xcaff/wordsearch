export type EventMap = {
  "landing:view": {};
  "landing:clickEnterPuzzle": {};
  "landing:clickExample": { name: string };

  "input:view": PuzzleMetadata;
  "input:editPuzzle": { beforeLength: number; afterLength: number };
  "input:addWord": { existingWordsCount: number };
  "input:pasteWords": { lines: number; totalLength: number };
  "input:removeWord": {
    removingWordAtIndex: number;
    totalWordsBeforeRemoving: number;
  };
  "input:clickSolvePuzzle": PuzzleMetadata;

  "puzzle:view": PuzzleViewProperties;
  "puzzle:clickEdit": {};
  "puzzle:clickSave": {};
};

interface PuzzleMetadata {
  totalWordsCount: number;
  puzzleLength: number;
  puzzleRows: number;
}

interface SolvedPuzzleMetadata extends PuzzleMetadata {
  matchesCount: number;
}

export type PuzzleViewProperties =
  | ({
      type: "local";
    } & SolvedPuzzleMetadata)
  | { type: "remote"; id: string };

export interface BatchedEventsMessage {
  userId: string;
  sessionId: string;
  events: Event<any>[];
}

export interface Event<K extends keyof EventMap> {
  name: K;
  timestamp: Date;
  properties: EventMap[K];
}

export function makeEvent<K extends keyof EventMap>(
  name: K,
  properties: EventMap[K]
): Event<K> {
  return {
    name,
    timestamp: new Date(),
    properties,
  };
}

export function puzzleLengthForRows(rows: string[]): number {
  return (
    rows.reduce((acc, row) => acc + row.length, 0) +
    Math.max(rows.length - 1, 0)
  );
}
