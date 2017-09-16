import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Route,
  Switch,
  Redirect,
} from 'react-router-dom'

import InputSelection from './InputSelection';
import ImageInput from './ImageInput';
import TextInput from './TextInput';
import ViewPuzzle from './ViewPuzzle';

import './App.css';

// TODO: onMouseLeave isn't run sometimes when exiting a node. This causes the
// highlight to remain until another selection is made.

// TODO: WordList
// * Arrow Keys / Tab Selection

class App extends Component {
  render() {
    return (
      <Router>
        <Switch>
          <Route exact path='/' component={InputSelection} />

          <Route exact path='/input/text' component={TextInput} />
          <Route exact path='/input/image' component={ImageInput} />
          <Route exact path='/view' component={ViewPuzzle} />

          {/* Redirect any non-matching routes to the exact root. */}
          <Redirect from='/' to='/' />
        </Switch>
      </Router>
    );
  }
}

export default App;
