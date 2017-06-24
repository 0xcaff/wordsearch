import React, { Component } from 'react';
import Grid from './Grid';
import TextEntry from './TextEntry';
import List from './List';

import './App.css';

import { CharNode, ArrayGrid, connectGrid, findMatches as findMatchesGraph,
  Directions } from './wordsearch/search';
import { words, rows } from './wordsearch/data/states';

class App extends Component {
  state = {
    // The value of the stuff in the textbox used for inputting a wordsearch.
    textEntry: rows.join('\n'),

    // The requested words to find matches for.
    words: words,

    // An array of words (array of nodes) which are currently selected.
    selected: [],

    grid: null,
  };

  constructor(props) {
    super(props);

    this.buildGraph = this.buildGraph.bind(this);
    this.findMatches = this.findMatches.bind(this);

    this.addSelected = this.addSelected.bind(this);
    this.removeSelected = this.removeSelected.bind(this);
  }

  // [ [a, b, c], [d, e, f] ]
  addSelected(...selection) {
    console.log("Adding Selection");
    if (!selection) {
      return;
    }

    const newSelected = this.state.selected.slice();
    newSelected.push(...selection);

    this.setState({selected: newSelected});
  }

  removeSelected(...selection) {
    console.log("Removing Selection");
    if (!selection) {
      return;
    }

    const removing = new Set(selection);
    const newSelected = this.state.selected.filter(
      selected => !removing.has(selected));

    this.setState({selected: newSelected});
  }

  buildGraph(evt) {
    evt.preventDefault();

    // get rows
    const rows = this.state.textEntry.split(/\r?\n/);

    // create nodes
    const nodeRows = rows.map(row => row
          .split('')
          .map(khar => new CharNode(khar))
    );

    // build and connect grid
    const grid = ArrayGrid.fromArray(nodeRows);
    this.nodes = connectGrid(grid);

    // display grid
    this.setState({grid: grid});
  }

  findMatches(evt) {
    this.matches = findMatchesGraph(this.state.words, this.nodes,
      new Set(Object.keys(Directions)));

    this.setState({grid: this.state.grid.shallowCopy()});
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

  render() {
    console.log("App.render")

    const { grid, words, textEntry } = this.state;

    let results = null;
    if (grid) {
      results = (
        <div
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
              selected={this.state.selected}
              onSelect={this.addSelected}
              onUnselect={this.removeSelected} />
          </div>

          <div
            className='words-list'
            style={{
              // TODO: When this element breaks onto a new row, we should set
              // flex-grow 1 so it looks nice on smaller screens
              height: '100vh',
              overflowY: 'scroll',
              padding: '1em',
            }}>
            <h3>Words</h3>

            <List
              items={words}
              onChange={newItems => this.setState({words: newItems})}
              itemProps={(item) => ({
                onMouseEnter: _ => this.selectMatches(item),
                onMouseLeave: _ => this.unSelectMatches(item),
              })} />

            <div
              style={{margin: '2em'}}>
              <button onClick={this.findMatches}>Find Matches!</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="App">
        <div className="App-header">
          <h1>Wordsearch Solver</h1>
        </div>

        <p className="App-intro">
          Never solve a word search by hand again, start by entering your puzzle
          in the text box below.
        </p>

        <form
          onSubmit={this.buildGraph}
          className='container'>

          <TextEntry
            minimumRows={5}
            minimumColumns={20}
            value={textEntry}
            onChange={newValue => this.setState({textEntry: newValue})} />

          <button>Build Graph!</button>
        </form>

        { results }
      </div>
    );

    // TODO: Highlight word in list.
    // TODO: Allowed Directions
  }
}

export default App;
