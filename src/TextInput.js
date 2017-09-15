import React, { Component } from 'react';

import TextEntry from './TextEntry';
import List from './List';
import Button from './Button';

import './TextInput.css';

// TODO: This is kinda glitchy on chrome but it works fine in firefox.
class TextInput extends Component {
  state = { text: '', words: [] };

  constructor(props) {
    super(props);

    const { history: { state: { text, words } = {} } } = props;
    this.state = Object.assign({ text, words }, this.state);
  }

  render() {
    const { history } = this.props;
    const { text, words } = this.state;

    return (
      <div className='TextInput'>
        <header>
          <h1>Input Wordsearch Text</h1>
        </header>

        <main>
          <TextEntry
            minimumRows={5}
            minimumColumns={20}
            value={text}
            placeholder="Enter puzzle"
            onChange={ newValue => this.setState({ text: newValue }) } />

          <List
            items={words}
            onChange={newItems => this.setState({ words: newItems })} />
        </main>

        <footer>
          <Button
            onClick={() => history.push('/view', { text, words })}>
              Solve Puzzle!
          </Button>
        </footer>
      </div>
    );
  }
}

export default TextInput;
