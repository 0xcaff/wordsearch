import React, { Component } from 'react';

import TextEntry from './TextEntry';
import List from './List';
import Button from './Button';

import './TextInput.css';

class TextInput extends Component {
  constructor(props) {
    super(props);

    const { location: {
      state: { text, words } = { text: '', words: [] }
    } } = props;

    this.state = { text, words };
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
