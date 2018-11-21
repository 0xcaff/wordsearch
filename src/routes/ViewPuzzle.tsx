import React, {Component} from 'react';
import {Set, Record} from 'immutable';
import styles from './ViewPuzzle.module.css';
import WordList from "../components/WordList";

interface Props {
  rows: string[],
  words: string[],
  toEditor: () => void,
}

interface Position {
  rowIdx: number,
  colIdx: number,
}

interface State {
  /**
   * A set of words which is focused. When a word is focused it becomes highlighted in the word list.
   */
  focused: Set<string>

  /**
   * A set of positions in the puzzle which should be highlighted.
   */
  selected: Set<Record<Position>>
}

class ViewPuzzle extends Component<Props, State> {
  state = {
    focused: Set(),
    selected: Set(),
  };

  focusWord = (word: string) =>
    this.setState((state) => ({focused: state.focused.add(word)}));

  unFocusWord = (word: string) =>
    this.setState((state) => ({focused: state.focused.delete(word)}));

  render() {
    return <div className={styles.container}>
      <div className={styles.mainArea}>
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

export default ViewPuzzle;
