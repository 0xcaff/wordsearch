import React, {Component} from 'react';
import styles from './ViewPuzzle.module.css';
import {Set} from 'immutable';
import WordList from "../components/WordList";
import Puzzle from "../components/Puzzle";

interface Props {
  rows: string[],
  words: string[],
  toEditor: () => void,
}

interface State {
  /**
   * A set of words which is focused. When a word is focused it becomes highlighted in the word list.
   */
  focused: Set<string>
}

class ViewPuzzle extends Component<Props, State> {
  state = {
    focused: Set(),
  };

  focusWord = (word: string) =>
    this.setState((state) => ({focused: state.focused.add(word)}));

  unFocusWord = (word: string) =>
    this.setState((state) => ({focused: state.focused.delete(word)}));

  render() {
    return <div className={styles.container}>
      <div className={styles.mainArea}>
        <Puzzle rows={this.props.rows} />
      </div>

      <div className={styles.sidebar}>
        <WordList
          words={this.props.words.map(word => ({word, isFocused: this.state.focused.has(word)}))}
          onBack={this.props.toEditor}
        />
      </div>
    </div>;
  }
}

// TODO:
// Compute:
//  * Map of Word -> Matches
//  * Map of Every Position -> Matches Over Position
//  * Rows and Cols in Puzzle

export default ViewPuzzle;
