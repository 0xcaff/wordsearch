import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import InputSelection from './routes/InputSelection';
import ImageInput from './routes/ImageInput';
import TextInput from './routes/TextInput';
import ViewPuzzle from './routes/ViewPuzzle';
import Analytics from './analytics/component';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div>
          <Analytics />
          <Switch>

            <Route exact path='/' component={InputSelection} />

            <Route exact path='/input/text' component={TextInput} />
            <Route exact path='/input/image/:example?' component={ImageInput} />
            <Route exact path='/view/:example?' component={ViewPuzzle} />

            {/* Redirect any non-matching routes to the exact root. */}
            <Redirect from='/' to='/' />
          </Switch>
        </div>
      </Router>
    );
  }
}

export default App;
