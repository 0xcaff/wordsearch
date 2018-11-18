import React, { Component, Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import { centered } from './components/shared.module.css';
import Analytics from './analytics/component';
import Loading from "./components/Loading";

const InputSelection = lazy(() => import("./routes/InputSelection"));
const TextInput = lazy(() => import("./routes/TextInput"));
const ViewPuzzle = lazy(() => import("./routes/ViewPuzzle"));

class App extends Component {
  render() {
    return (
      <Suspense fallback={
        <div className={centered}>
          <Loading />
        </div>
      }>
      <Router>
        <div className='App'>
          <Analytics />

          <Switch>

            <Route
              path='/'
              render={props => <InputSelection {...props} />}
              exact />

            <Route
              path='/input/text'
              render={props => <TextInput {...props} />}
              exact />

            {/*
            <Route
              path='/input/image/:example?'
              component={ImageInput}
              exact />
            */}

            <Route
              path='/view/:example?'
              render={props => <ViewPuzzle {...props} />}
              exact />

            {/* Redirect any non-matching routes to the exact root. */}
            <Redirect from='/' to='/' />
          </Switch>
        </div>
      </Router>
      </Suspense>
    );
  }
}

export default App;
