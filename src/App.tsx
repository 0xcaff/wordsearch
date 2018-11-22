import React, { Component, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import Analytics from "./analytics/component";
import { FullPageLoading } from "./components/Loading";
import { puzzles } from "wordsearch-algo";
import DataFetcher from "./components/DataFetcher";

const InputSelection = lazy(() => import("./routes/InputSelection"));
const TextInput = lazy(() => import("./routes/TextInput"));
const ViewPuzzle = lazy(() => import("./routes/ViewPuzzle"));

class App extends Component {
  render() {
    return (
      <Suspense fallback={<FullPageLoading />}>
        <Router>
          <div className="App">
            <Analytics />

            <Switch>
              <Route path="/" render={() => <InputSelection />} exact />

              <Route
                path="/input/text"
                render={props => (
                  <TextInput
                    startingRows={
                      props.location.state && props.location.state.rows
                    }
                    startingWords={
                      props.location.state && props.location.state.words
                    }
                    solvePuzzle={(rows, words) =>
                      props.history.push("/view", { rows, words })
                    }
                  />
                )}
                exact
              />

              <Route
                path="/view/:id?"
                render={props => {
                  const puzzle = normalizePuzzle(
                    props.match.params.id,
                    props.location.state
                  );
                  if (!puzzle) {
                    props.history.push("/");
                    return null;
                  }

                  return (
                    <DataFetcher
                      id={props.match.params.id}
                      data={props.location.state}
                    >
                      {childProps => {
                        if (childProps.isLoading) {
                          return <FullPageLoading />;
                        }

                        return (
                          <ViewPuzzle
                            words={childProps.data.words}
                            rows={childProps.data.rows}
                            toEditor={() =>
                              props.history.push("/input/text", puzzle)
                            }
                          />
                        );
                      }}
                    </DataFetcher>
                  );
                }}
                exact
              />

              {/* Redirect any non-matching routes to the exact root. */}
              <Redirect from="/" to="/" />
            </Switch>
          </div>
        </Router>
      </Suspense>
    );
  }
}

export default App;

interface Puzzle {
  words: string[];
  rows: string[];
}

const normalizePuzzle = (
  exampleName?: string,
  puzzle?: Puzzle
): Puzzle | undefined => {
  if (puzzle) {
    return puzzle;
  } else {
    return puzzles.find(puzzle => puzzle.name === exampleName);
  }
};
