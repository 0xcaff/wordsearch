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
import CreatePuzzle from "./components/CreatePuzzle";
import { NotFound } from "./components/NotFound";

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
                  if (!puzzle) {
                    return <NotFound />;
                  }

                  return (
                    <CreatePuzzle
                      onCreated={id => props.history.replace(`/view/${id}`)}
                    >
                      {mutationProps => (
                        <ViewPuzzle
                          words={puzzle.data.words}
                          rows={puzzle.data.rows}
                          toEditor={() =>
                            props.history.push("/input/text", puzzle.data)
                          }
                          isFromRemote={!puzzle.isFromLocal}
                          isCreating={mutationProps.isCreating}
                          onCreate={() => mutationProps.create(puzzle.data)}
                        />
                      )}
                    </CreatePuzzle>
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
