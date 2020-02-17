import React, { Component, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import Analytics from "./analytics/component";
import { FullPageLoading } from "./components/Loading";

const InputSelection = lazy(() => import("./routes/InputSelection"));
const TextInput = lazy(() => import("./routes/TextInput"));
const ViewPuzzleWithData = lazy(() => import("./routes/ViewPuzzle"));

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
                render={props => (
                  <ViewPuzzleWithData
                    id={props.match.params?.id}
                    puzzleData={props.location.state}
                    viewPuzzle={puzzleId =>
                      props.history.replace(`/view/${puzzleId}`)
                    }
                    toEditorWithPuzzle={puzzle =>
                      props.history.push("/input/text", puzzle)
                    }
                  />
                )}
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
