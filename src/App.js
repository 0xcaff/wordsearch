import React, { Component } from "react";
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect
} from "react-router-dom";

import { asyncComponent } from "./components/Loadable";

import Analytics from "./analytics/component";

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <Analytics />

          <Switch>
            <Route
              path="/"
              component={asyncComponent(() =>
                import(/* webpackChunkName: "home" */ "./routes/InputSelection")
              )}
              exact
            />

            <Route
              path="/input/text"
              component={asyncComponent(() =>
                import(/* webpackChunkName: "text" */ "./routes/TextInput")
              )}
              exact
            />

            <Route
              path="/input/image/:example?"
              component={asyncComponent(() =>
                import(/* webpackChunkName: "image" */ "./routes/ImageInput")
              )}
              exact
            />

            <Route
              path="/view/:example?"
              component={asyncComponent(() =>
                import(/* webpackChunkName: "view" */ "./routes/ViewPuzzle")
              )}
              exact
            />

            {/* Redirect any non-matching routes to the exact root. */}
            <Redirect from="/" to="/" />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
