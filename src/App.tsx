import React, { Component, Suspense, lazy } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import styles from './components/shared.module.css';
import Analytics from './analytics/component';
import Loading from "./components/Loading";

const InputSelection = lazy(() => import("./routes/InputSelection"));
const TextInput = lazy(() => import("./routes/TextInput"));
// const ViewPuzzle = lazy(() => import("./routes/ViewPuzzle"));

class App extends Component {
  render() {
    return (
      <Suspense fallback={
        <div className={styles.centered}>
          <Loading />
        </div>
      }>
      <Router>
        <div className='App'>
          <Analytics />

          <Switch>

            <Route
              path='/'
              render={props =>
                <InputSelection
                  goToExample={example => props.history.push(`/view/${example}`)}
                  goToTextInput={() => props.history.push('/input/text')} />
              }
              exact />

            <Route
              path='/input/text'
              render={props =>
                <TextInput
                  startingRows={props.location.state && props.location.state.rows}
                  startingWords={props.location.state && props.location.state.words}
                  solvePuzzle={
                    (rows, words) => props.history.push('/view', { rows, words })
                  } />
              }
              exact />

            {/*
            <Route
              path='/view/:example?'
              render={props => <ViewPuzzle {...props} />}
              exact />
              */}

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
