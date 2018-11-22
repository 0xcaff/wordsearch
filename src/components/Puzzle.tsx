import React, {Component, CSSProperties} from 'react';
import styles from './Puzzle.module.css';
import PuzzleNodes from "./PuzzleNodes";
import {Map, Record} from "immutable";

import {Match} from 'wordsearch-algo/lib/search/algorithms';
import {findMatches} from "wordsearch-algo/lib/search/prefix";
import {tweenPosition} from "../tweenPosition";

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

const PositionRecord: Record.Factory<Position> = Record({ rowIdx: -1, colIdx: -1 });

interface State {
  pointerPosition?: Position,
}

class Puzzle extends Component<Props, State> {
  state = {} as State;

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

    let matchesAt = Map<Record<Position>, Match[]>();
    for (let idx = 0; idx < matches.length; idx++) {
      const match = matches[idx];

      for (const position of tweenPosition(match.start.rowIdx, match.start.colIdx, match.end.rowIdx, match.end.colIdx)) {
        const record = PositionRecord({ colIdx: position.col, rowIdx: position.row });
        let array = matchesAt.get(record);

        if (!array) {
          array = [];
          matchesAt = matchesAt.set(record, array);
        }

        array.push(match);
      }
    }

    const highlighted = [];
    const hovered = [];
    let matchesAtPointer = [] as Match[];
    if (this.state.pointerPosition) {
      const record = PositionRecord(this.state.pointerPosition);
      matchesAtPointer = matchesAt.get(record) || [];
    }

    for (let idx = 0; idx < matches.length; idx++) {
      const match = matches[idx];

      highlighted.push(
        [match.start.rowIdx, match.start.colIdx, match.end.rowIdx, match.end.colIdx]
      );

      if (matchesAtPointer.includes(match) || this.props.selectedWord && match.word === this.props.selectedWord) {
        hovered.push(idx);
      }
    }

    return {
      '--rows': size.rowsCount,
      '--cols': size.colsCount,
      '--highlighted': JSON.stringify(highlighted),
      '--hovered': JSON.stringify(hovered),
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

export default Puzzle;
