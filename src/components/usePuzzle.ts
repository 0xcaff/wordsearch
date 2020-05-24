import React, { useContext } from "react";
import { PuzzleData, PuzzleWithId } from "../database";
import { database } from "../database";

interface Args {
  id?: string;
  data?: PuzzleData;
}

export type ResolvedData =
  | {
      isFromLocal: false;
      id: string;
      data: PuzzleData;
    }
  | {
      isFromLocal: true;
      data: PuzzleData;
    };

export const usePuzzle = (args: Args): ResolvedData | null => {
  const context = useContext<DataFetcherContextState>(DataFetcherContext);
  const data = args.data;
  if (data) {
    return { isFromLocal: true, data };
  }

  const id = args.id;
  if (!id) {
    return null;
  }

  const resolved = getFromCacheOrFetch(context, id);
  if (!resolved) {
    return null;
  }

  return { isFromLocal: false, data: resolved, id };
};

function getFromCacheOrFetch(
  context: DataFetcherContextState,
  key: string
): PuzzleWithId | null {
  const fromCache = context.cached.get(key);
  if (!fromCache) {
    const promiseWithState: PromiseWithState<PuzzleWithId | null> = {
      state: { state: "LOADING" as const },
      promise: database
        .getPuzzle(key)
        .then((value) => {
          promiseWithState.state = { state: "RESOLVED", value };
        })
        .catch((value) => {
          promiseWithState.state = { state: "REJECTED", value };
        }),
    };

    context.cached.set(key, promiseWithState);
    throw promiseWithState.promise;
  }

  const promiseCompletionState = fromCache.state;
  switch (promiseCompletionState.state) {
    case "LOADING": {
      throw fromCache.promise;
    }
    case "RESOLVED": {
      return promiseCompletionState.value;
    }
    case "REJECTED":
      throw promiseCompletionState.value;
  }
}

interface DataFetcherContextState {
  cached: Map<string, PromiseWithState<PuzzleWithId | null>>;
}

const DataFetcherContext = React.createContext<DataFetcherContextState>({
  cached: new Map(),
});

interface PromiseWithState<T> {
  promise: Promise<void>;
  state: PromiseState<T>;
}

type PromiseState<T> =
  | PromiseStateLoading
  | PromiseStateResolved<T>
  | PromiseStateRejected;

interface PromiseStateLoading {
  state: "LOADING";
}

interface PromiseStateResolved<T> {
  state: "RESOLVED";
  value: T;
}

interface PromiseStateRejected {
  state: "REJECTED";
  value?: any;
}
