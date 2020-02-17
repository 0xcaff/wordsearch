import React, { Component, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import Analytics from "./analytics/component";
import { FullPageLoading } from "./components/Loading";
import { usePuzzle } from "./components/usePuzzle";
import { NotFound } from "./components/NotFound";
import { useWithLoading } from "./components/useWithLoading";
import { database, PuzzleData } from "./database";

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
                  const puzzle = usePuzzle({
                    id: props.match.params.id,
                    data: props.location.state
                  });

                  const {
                    load: create,
                    isLoading: isCreating
                  } = useWithLoading(async (puzzle: PuzzleData) => {
                    const newPuzzle = await database.newPuzzle(puzzle);
                    props.history.replace(`/view/${newPuzzle.id}`);
                  });

                  if (!puzzle) {
                    return <NotFound />;
                  }

                  return (
                    <ViewPuzzle
                      words={puzzle.data.words}
                      rows={puzzle.data.rows}
                      toEditor={() =>
                        props.history.push("/input/text", puzzle.data)
                      }
                      isFromRemote={!puzzle.isFromLocal}
                      isCreating={isCreating}
                      onCreate={() => create(puzzle?.data)}
                    />
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
