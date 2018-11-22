import React, {Component, CSSProperties} from 'react';
import styles from './Puzzle.module.css';
import PuzzleNodes from "./PuzzleNodes";
import {findMatches} from "wordsearch-algo/lib/search/prefix";

interface Props {
  words: string[],
  rows: string[],

  /**
   * Called to focus a word in the word list.
   * @param word The word to focus.
   */
  focusWord: (word: string) => void,

  /**
   * Called to un-focus a word in the word list.
   * @param word The word to un-focus.
   */
  unFocusWord: (word: string) => void,

  /**
   * Word which was selected in the word list by the user.
   */
  selectedWord?: string
}

export interface Position {
  rowIdx: number,
  colIdx: number,
}

interface State {
  pointerPosition?: Position,
}

class Puzzle extends Component<Props, State> {
  onSelect = (pointerPosition: Position) =>
    this.setState({ pointerPosition });

  getMatches = () => findMatches(this.props.rows, this.props.words);

  getSize = () => {
    let colsCount = 0;

    for (const row of this.props.rows) {
      colsCount = Math.max(colsCount, row.length);
    }

    return { rowsCount: this.props.rows.length, colsCount };
  };

  getStyle = (): CSSProperties => {
    const matches = this.getMatches();
    const size = this.getSize();

    return {
      '--rows': size.rowsCount,
      '--cols': size.colsCount,
      '--highlighted': JSON.stringify(matches.map(match =>
        [match.start.rowIdx, match.start.colIdx, match.end.rowIdx, match.end.colIdx])),
      '--hovered': JSON.stringify([]),
    } as CSSProperties;
  };

  render() {
    return (
      <div
        className={styles.grid}
        style={this.getStyle()}
        onPointerLeave={() => this.setState({ pointerPosition: undefined })}>
        <PuzzleNodes
          rows={this.props.rows}
          onSelect={this.onSelect} />
      </div>
    );
  }
}

// @ts-ignore
const getOrAdd = <K, V>(map: Map<K, V>, key: K, makeDefault: () => V): V => {
  if (map.has(key)) {
    return map.get(key)!!
  }

  const val = makeDefault();
  map.set(key, val);
  return val;
};

export default Puzzle;

// TODO:
// Compute:
//  * Map of Word -> Matching Positions
//  * Map of Every Position -> Matches Over Position

