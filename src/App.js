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

// TODO: Add a new flow which allows uploading an image instead of entering the
// puzzle and words manually.
//
// * First we need a dropzone / input type=file / url input to obtain the file.
// * Next, pass the file to google cloud vision
//   * This may require authentication.
//   * Files will be base64 read into memory and posted to GCV
//
// * Display the information from GCV
//   * Put boxes around the text.
//
// * Select parts of the image and put then into the grid textbox. Somehow, we
// need to detect which elements are where on the grid.
//
// * Select parts of the images which are words and put them into a textbox so
// the inference can be cleaned and used.

// TODO: onMouseLeave isn't run sometimes when exiting a node. This causes the
// highlight to remain until another selection is made.

// TODO: WordList
// * Arrow Keys / Tab Selection
// * Edit + Remove
// * Automatically call findMatches
// * Use one when inputting to simplify the two flows.

// TODO: Save last entered puzzle into localStorage
// TODO: The navbar is big and ugly.
// TODO: The text in the text area is a little small.
// TODO: The TextEntry is too small in chrome (doesn't seem to account for
// letter-spacing).

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
