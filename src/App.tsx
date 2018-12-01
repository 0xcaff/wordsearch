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
import ImageInput from "./routes/ImageInput";

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
              <Route
                path="/"
                render={props => (
                  <InputSelection
                    selectFromImageFile={file =>
                      props.history.push("/input/image", { file })
                    }
                  />
                )}
                exact
              />

              <Route
                path="/input/image"
                render={props => (
                  <ImageInput file={props.location.state.file} />
                )}
              />

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
                  return (
                    <DataFetcher
                      id={props.match.params.id}
                      data={props.location.state}
                    >
                      {queryProps => {
                        if (queryProps.isLoading) {
                          return <FullPageLoading />;
                        }

                        return (
                          <CreatePuzzle
                            onCreated={id =>
                              props.history.replace(`/view/${id}`)
                            }
                          >
                            {mutationProps => (
                              <ViewPuzzle
                                words={queryProps.data.words}
                                rows={queryProps.data.rows}
                                toEditor={() =>
                                  props.history.push(
                                    "/input/text",
                                    queryProps.data
                                  )
                                }
                                isFromRemote={!queryProps.isFromLocal}
                                isCreating={mutationProps.isCreating}
                                onCreate={() =>
                                  mutationProps.create(queryProps.data)
                                }
                              />
                            )}
                          </CreatePuzzle>
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
