import React, { Component, Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import Analytics from "./analytics/component";
import { FullPageLoading } from "./components/Loading";
import DataFetcher from "./components/DataFetcher";
import CreatePuzzle from "./components/CreatePuzzle";

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
                render={props => (
                  <DataFetcher
                    id={props.match.params.id}
                    data={props.location.state}
                  >
                    {queryProps => (
                      <CreatePuzzle
                        onCreated={id => props.history.replace(`/view/${id}`)}
                      >
                        {mutationProps => (
                          <ViewPuzzle
                            words={queryProps.data.words}
                            rows={queryProps.data.rows}
                            toEditor={() =>
                              props.history.push("/input/text", queryProps.data)
                            }
                            isFromRemote={!queryProps.isFromLocal}
                            isCreating={mutationProps.isCreating}
                            onCreate={() =>
                              mutationProps.create(queryProps.data)
                            }
                          />
                        )}
                      </CreatePuzzle>
                    )}
                  </DataFetcher>
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
