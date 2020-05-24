import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from "react-router-dom";

import { FullPageLoading } from "./components/Loading";
import { AnalyticsProvider } from "./clientAnalyticsEvents";

const InputSelection = lazy(() => import("./routes/InputSelection"));
const TextInput = lazy(() => import("./routes/TextInput"));
const ViewPuzzleWithData = lazy(() => import("./routes/ViewPuzzle"));

const App = () => (
  <AnalyticsProvider>
    <Suspense fallback={<FullPageLoading />}>
      <Router>
        <div className="App">
          <Switch>
            <Route path="/" render={() => <InputSelection />} exact />

            <Route
              path="/input/text"
              render={(props) => (
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
              render={(props) => (
                <ViewPuzzleWithData
                  id={props.match.params?.id}
                  puzzleData={props.location.state}
                  viewPuzzle={(puzzleId) =>
                    props.history.replace(`/view/${puzzleId}`)
                  }
                  toEditorWithPuzzle={(puzzle) =>
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
  </AnalyticsProvider>
);

export default App;
