import React, { Component } from 'react';

import './ViewPuzzle.css';

import Grid from '../components/grid/Grid';
import List from '../components/List';
import Button from '../components/Button';
import ResponsiveTwoPane from '../components/ResponsiveTwoPane';

import { solve } from '../wordsearch';

import puzzles from '../wordsearch/data';

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

    const {
      location: { state },
      history,
      match: { params: { example } }
    } = props;

    const normalizedState = normalizeState(state, example);
    if (!normalizedState) {
      history.push('/');
      return;
    }

    const { rows, words } = normalizedState;
    const { matches, grid } = solve(rows, words);

    // Bind methods once in the constructor to prevent re-rendering in pure
    // child components.
    this.onSelect = this.onSelect.bind(this);
    this.clearSelected = this.clearSelected.bind(this);
    this.selectMatches = this.selectMatches.bind(this);

    Object.assign(this, { words, matches, grid, rows });
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
    const { grid, words, onSelect, rows, clearSelected, selectMatches } = this;
    const { selected, focused } = this.state;
    const { history } = this.props;

    if (!grid || !words) {
      // Short circuit if transitioning to a new page because insufficient
      // parameters were passed.
      return null;
    }

    const sidebar =
      <WordList
        words={words}
        focused={focused}
        onBackClicked={ () => history.push('/input/text', { rows, words }) }
        onSelectWord={selectMatches}
        onUnselectWord={clearSelected} />

    return (
      <ResponsiveTwoPane
        sidebar={sidebar}
        options={{
          pullRight: true,
          rootClassName: 'ViewPuzzle',
          styles: {
            content: {
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-around',
              overflowY: 'auto',
            },
            sidebar: {
              padding: '1em 2em',

              // Above the node content and overlays. See
              // components/grid/Node.css and components/grid/GridSelection.css
              zIndex: 15,
              background: 'white',
            },
            overlay: {
              // Less than sidebar and more than compnents/grid/Node.css and
              // components/grid/GridSelection.css
              zIndex: 14,
            },
            dragHandle: {
              // Same level as overlay.
              zIndex: 14,
            }
          }
        }}>
          <Content
            grid={grid}
            selected={selected}
            onSelect={onSelect}
            clearSelected={clearSelected} />

      </ResponsiveTwoPane>
    );
  }
}

const WordList = ({
  words, focused, onBackClicked, onSelectWord, onUnselectWord, sidebarOpen,
  sidebarDocked,
}) =>
  <div
    className='WordList'>
    <h3>Words</h3>

    <List
      items={words}
      scrollFocusedIntoView={sidebarOpen || sidebarDocked}
      focused={focused}
      itemProps={(item) => ({
        onMouseEnter: _ => onSelectWord(item),
        onMouseLeave: _ => onUnselectWord(item),

        onFocus: _ => onSelectWord(item),
        onBlur: _ => onUnselectWord(item),

        tabIndex: '0',
      })} />

    <div className='BackButton'>
      <Button
        onClick={ onBackClicked }>
          Back to Editor
      </Button>
    </div>
  </div>

const Content = ({
  grid, selected, onSelect, clearSelected, onSetSidebarOpen, sidebarOpen,
  sidebarDocked,
}) => [ <Grid
    key='grid'
    grid={grid}
    selected={selected}
    onSelect={onSelect}
    onMouseLeave={clearSelected} />,

  !sidebarOpen && !sidebarDocked &&
    <span
      key='expand'
      className='Expand clickable'
      onClick={ () => onSetSidebarOpen(true) } >
        {"<<"}
    </span>
];

const normalizeState = (state, example) => {
  if (state) {
    return state;
  } else if (example && puzzles[example]) {
    return puzzles[example];
  }
}

export default ViewPuzzle;
