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

import './App.css';

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
