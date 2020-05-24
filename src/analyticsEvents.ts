export type EventMap = {
  "landing:view": {};
  "landing:clickEnterPuzzle": {};
  "landing:clickExample": { name: string };

  "input:view": {};
  "input:editPuzzle": { beforeLength: number; afterLength: number };
  "input:addWord": { existingWordsCount: number };
  "input:pasteWords": { lines: number; totalLength: number };
  "input:removeWord": {
    removingWordAtIndex: number;
    totalWordsBeforeRemoving: number;
  };
  "input:clickSolvePuzzle": { totalWordsCount: number; puzzleLength: number };

  "puzzle:view": PuzzleViewProperties;
  "puzzle:clickEdit": {};
  "puzzle:clickSave": {};
};

export type PuzzleViewProperties =
  | { type: "local" }
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
