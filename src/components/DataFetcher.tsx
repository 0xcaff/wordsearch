import React, { useContext } from "react";
import styles from "./DataFetcher.module.css";
import { PuzzleData, PuzzleWithId } from "../database";
import { database } from "../database";

interface Props {
  id?: string;
  data?: PuzzleData;
  children: (state: ChildProps) => React.ReactElement;
}

interface ChildProps {
  isFromLocal: boolean;
  data: PuzzleData;
}

const DataFetcher: React.FC<Props> = (props: Props): React.ReactElement => {
  const context = useContext<DataFetcherContextState>(DataFetcherContext);

  const data = props.data;
  if (data) {
    return props.children({ isFromLocal: true, data });
  } else if (props.id) {
    const data = getFromCacheOrFetch(context, props.id);
    if (data === null) {
      return <NotFound />;
    }

    return props.children({ isFromLocal: false, data });
  } else {
    return <NotFound />;
  }
};

const NotFound = () => <div className={styles.notFound}>Not Found :(</div>;

export default DataFetcher;

function getFromCacheOrFetch(
  context: DataFetcherContextState,
  key: string
): PuzzleWithId | null {
  const fromCache = context.cached.get(key);
  if (!fromCache) {
    const promiseWithState = {
      state: { state: "LOADING" } as PromiseState<PuzzleWithId | null>,
      promise: database
        .getPuzzle(key)
        .then(value => {
          promiseWithState.state = { state: "RESOLVED", value };
        })
        .catch(value => {
          promiseWithState.state = { state: "REJECTED", value };
        })
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
  cached: new Map()
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
