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

    grid: null,
  };

  constructor(props) {
    super(props);

    this.buildGraph = this.buildGraph.bind(this);
    this.findMatches = this.findMatches.bind(this);
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

    this.setState({grid: this.state.grid});
  }

  doOnMatches(word, thing) {
    if (!this.matches) {
      // the matches haven't been found yet
      return;
    }

    const matches = this.matches[word];
    if (!matches) {
      // no match, show some feedback
      return;
    }

    for (const match of matches) {
      for (const node of match) {
        thing(node);
      }
    }

    // update grid
    this.setState({grid: this.state.grid});
  }

  render() {
    console.log("App.render")

    let results = null;
    if (this.state.grid) {
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
              flexBasis: `${this.state.grid.columns()}em`,
              flexGrow: 1,
            }}>
            <Grid
              grid={this.state.grid} />
          </div>

          <div
            className='words-list'
            style={{
              // TODO: When this element breaks onto a new row, we should set
              // flex-grow 1
              height: '100vh',
              overflowY: 'scroll',
              padding: '1em',
            }}>
            <h3>Words</h3>

            <List
              items={this.state.words}
              onChange={newItems => this.setState({words: newItems})}
              itemProps={(item) => ({
                onMouseEnter: _ => this.doOnMatches(item, node => node.marked = true),
                onMouseLeave: _ => this.doOnMatches(item, node => node.marked = false),
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
            value={this.state.textEntry}
            onChange={newValue => this.setState({textEntry: newValue})} />

          <button>Build Graph!</button>
        </form>

        { results }
      </div>
    );

    // TODO: Highlight word in list.
    // TODO: Allowed Directions
    // TODO: Two Pane Layout, height: 100% in pane? Grid with auto-fit
  }
}

export default App;
