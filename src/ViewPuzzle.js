import React, { Component } from 'react';

import './ViewPuzzle.css';

import Grid from './Grid';
import List from './List';

import { solve } from './wordsearch';

// TODO: It's slow in firefox because of the layout.

// A component which given a 2D text input, and a wordlist displays the
// wordsearch, solves it and displays the results.
class ViewPuzzle extends Component {
  // A list of words for which we are searching.
  words = [];

  // A list of nodes in the puzzle. This is used by the search algorithm.
  // nodes = [];

  // A Grid used to render the puzzle.
  grid = null;

  state = {
    // Words in the wordlist which should be brought into focus.
    focused: [],

    // Nodes which are selected.
    selected: [],
  };

  constructor(props) {
    super(props);

    const { location, history } = props;
    if (!location.state) {
      history.replace('/');
      return;
    }

    const { state: { words, text } } = location;

    // get rows
    const rows = text.split(/\r?\n/);
    const { matches, grid } = solve(rows, words);

    this.onSelect = this.onSelect.bind(this);
    this.onUnselect = this.onSelect.bind(this);

    Object.assign(this, { words, matches, grid });
  }

  onSelect(...selection) {
    const focused = selection.map(nodes =>
      nodes.map(node => node.value).join('')
    );
    this.setState({ focused: focused });

    this.addSelected(...selection);
  }

  onUnselect(...selection) {
    this.setState({ focused: [] });
    this.removeSelected(...selection);
  }

  selectMatches(word) {
    if (!this.matches) {
      // the matches haven't been found yet
      return;
    }

    const matches = this.matches[word];
    if (!matches) {
      // no match, show some feedback
      return;
    }

    this.addSelected(...matches);
  }

  unSelectMatches(word) {
    if (!this.matches) {
      // the matches haven't been found yet
      return;
    }

    const matches = this.matches[word];
    if (!matches) {
      // no match, show some feedback
      return;
    }

    this.removeSelected(...matches);
  }

  // [a, b, c], [d, e, f]
  addSelected(...selection) {
    if (!selection || !selection.length) {
      return;
    }

    // replace with new selection
    this.setState({ selected: selection });
  }

  removeSelected(...selection) {
    if (!selection || !selection.length) {
      return;
    }

    // always clear all selected items
    this.setState({ selected: [] });
  }

  render() {
    const { grid, words, onSelect, onUnselect } = this;
    const { selected, focused } = this.state;

    if (!grid || !words) {
      // Short circuit if transitioning to a new page because insufficient
      // parameters were passed.
      return null;
    }

    return (
      <div
        className='ViewPuzzle'
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          justifyContent: 'space-around',
          breakBefore: 'page',
        }}>
        <div
          style={{
            maxWidth: '100vmin', // TODO: using vmin here makes long grids to break
            padding: '1em',
            alignSelf: 'center',
            flexBasis: `${grid.columns()}em`,
            flexGrow: 1,
          }}>

          <Grid
            grid={grid}
            selected={selected}
            onSelect={onSelect}
            onUnselect={onUnselect} />
        </div>

        <div
          className='WordList'
          style={{
            // TODO: When this element breaks onto a new row, we should set
            // flex-grow 1 so it looks nice on smaller screens
          }}>
          <h3>Words</h3>

          <List
            items={words}
            focused={focused}
            itemProps={(item) => ({
              onMouseEnter: _ => this.selectMatches(item),
              onMouseLeave: _ => this.unSelectMatches(item),

              onFocus: _ => this.selectMatches(item),
              onBlur: _ => this.unSelectMatches(item),

              tabIndex: '0',
            })} />
        </div>
      </div>
    );
  }
}

export default ViewPuzzle;
