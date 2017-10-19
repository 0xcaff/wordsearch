import React, { Component } from 'react';

import TextEntry from '../components/TextEntry';
import List from '../components/List';
import Button from '../components/Button';

import './TextInput.css';

class TextInput extends Component {
  constructor(props) {
    super(props);

    const {
      location: { state: { rows, words } = { rows: [], words: [] } },
    } = props;

    const text = rows.join('\n');
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
            onClick={() => history.push('/view', { rows: text.split('\n'), words })}>
              Solve Puzzle!
          </Button>
        </footer>
      </div>
    );
  }
}

export default TextInput;
