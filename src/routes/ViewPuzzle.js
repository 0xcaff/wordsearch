import React, { Component } from 'react';

import './ViewPuzzle.css';

import Grid from '../components/grid/Grid';
import List from '../components/List';
import Button from '../components/Button';

import { solve } from '../wordsearch';

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

    // Bind methods once in the constructor to prevent re-rendering in pure
    // child components.
    this.onSelect = this.onSelect.bind(this);
    this.clearSelected = this.clearSelected.bind(this);

    Object.assign(this, { words, matches, grid, text });
  }

  // Called when a grid node is moused over with a list of list of nodes to
  // select.
  onSelect(...selection) {
    const focused = selection.map(nodes =>
      nodes
        .map(node => node.value)
        .join('')
    );

    this.setState({ focused, selected: selection });
  }

  // Called when a word in the word list is moused over.
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

    this.setState({ selected: matches });
  }

  clearSelected() {
    this.setState({ selected: [] });
  }

  render() {
    const { grid, words, onSelect, text, clearSelected } = this;
    const { selected, focused } = this.state;
    const { history } = this.props;

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
            maxWidth: '100vmin',
            padding: '1em',
            alignSelf: 'center',
            flexBasis: `${grid.columns()}em`,
            flexGrow: 1,
          }}>

          <Grid
            grid={grid}
            selected={selected}
            onSelect={onSelect}
            onMouseLeave={clearSelected} />
        </div>

        <div
          className='WordList'>
          <h3>Words</h3>

          <List
            items={words}
            focused={focused}
            itemProps={(item) => ({
              onMouseEnter: _ => this.selectMatches(item),
              onMouseLeave: this.clearSelected,

              onFocus: _ => this.selectMatches(item),
              onBlur: this.clearSelected,

              tabIndex: '0',
            })} />

          <div className='BackButton'>
            <Button
              onClick={ (e) => history.push('/input/text', { text, words }) }>
                Back to Editor
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ViewPuzzle;
