import React, { Component, CSSProperties } from "react";
import styles from "./Puzzle.module.css";
import PuzzleNodes, { Node } from "./PuzzleNodes";
import PuzzleGridHighlight from "./PuzzleGridHighlight";
import { Map, Record } from "immutable";
import memoize from "fast-memoize";

import { Match, Position, findMatches } from "wordsearch-algo";
import { tweenPosition } from "../tweenPosition";

interface Props {
  words: string[];
  rows: string[];

  /**
   * Called to focus words in the word list.
   * @param word The words to focus.
   */
  focusWords: (words: string[]) => void;

  /**
   * Word which was selected in the word list by the user.
   */
  selectedWord?: string;
}

interface State {
  pointerPosition?: Position;
}

const PositionRecord = Record({
  rowIdx: -1,
  colIdx: -1,
});

const getSize = memoize((rows: string[]) => {
  let colsCount = 0;

  for (const row of rows) {
    colsCount = Math.max(colsCount, row.length);
  }

  return { rowsCount: rows.length, colsCount };
});

export const getMatches = memoize((rows: string[], words: string[]) =>
  findMatches(rows, words)
);

const getMatchesAt = memoize((rows: string[], words: string[]) => {
  const matches = getMatches(rows, words);
  const recordType = PositionRecord();
  let matchesAt = Map<typeof recordType, Match[]>();
  for (let idx = 0; idx < matches.length; idx++) {
    const match = matches[idx];

    for (const position of tweenPosition(
      match.start.rowIdx,
      match.start.colIdx,
      match.end.rowIdx,
      match.end.colIdx
    )) {
      const record = PositionRecord(position);
      let array = matchesAt.get(record);

      if (!array) {
        array = [];
        matchesAt = matchesAt.set(record, array);
      }

      array.push(match);
    }
  }

  return matchesAt;
});

const getNodes = memoize((rows: string[], words: string[]): Node[] => {
  const matchesAt = getMatchesAt(rows, words);

  const nodes = rows.flatMap((row, rowIdx) =>
    row.split("").map((content, colIdx) => {
      const position = { rowIdx, colIdx };
      const matchesAtPosition = matchesAt.get(PositionRecord(position)) || [];

      return {
        content,
        position,
        isHighlighted: matchesAtPosition.length > 0,
      };
    })
  );

  return nodes;
});

const hasPaintWorklet = "paintWorklet" in CSS;

class Puzzle extends Component<Props, State> {
  state = {} as State;

  onSelect = (pointerPosition: Position) => {
    const matchesAt = getMatchesAt(this.props.rows, this.props.words);
    const matchesAtPointer =
      matchesAt.get(PositionRecord(pointerPosition)) || [];

    this.setState({ pointerPosition });
    this.props.focusWords(matchesAtPointer.map((match) => match.word));
  };

  getStyle = (): CSSProperties => {
    const size = getSize(this.props.rows);
    const matches = getMatches(this.props.rows, this.props.words);
    const matchesAt = getMatchesAt(this.props.rows, this.props.words);

    const highlighted = [];
    const hovered = [];
    let matchesAtPointer = [] as Match[];
    if (this.state.pointerPosition) {
      const record = PositionRecord(this.state.pointerPosition);
      matchesAtPointer = matchesAt.get(record) || [];
    }

    for (let idx = 0; idx < matches.length; idx++) {
      const match = matches[idx];

      highlighted.push([
        match.start.rowIdx,
        match.start.colIdx,
        match.end.rowIdx,
        match.end.colIdx,
      ]);

      if (
        matchesAtPointer.includes(match) ||
        (this.props.selectedWord && match.word === this.props.selectedWord)
      ) {
        hovered.push(idx);
      }
    }

    return {
      "--rows": size.rowsCount,
      "--cols": size.colsCount,
      "--highlighted": JSON.stringify(highlighted),
      "--hovered": JSON.stringify(hovered),
    } as CSSProperties;
  };

  render() {
    if (hasPaintWorklet) {
      return (
        <div
          className={[styles.grid, styles.withPaintWorklet].join(" ")}
          style={this.getStyle()}
          onPointerLeave={() => this.setState({ pointerPosition: undefined })}
        >
          <PuzzleNodes
            usePaintWorklet={true}
            nodes={getNodes(this.props.rows, this.props.words)}
            onSelect={this.onSelect}
          />
        </div>
      );
    } else {
      const matches = getMatches(this.props.rows, this.props.words);
      const matchesAt = getMatchesAt(this.props.rows, this.props.words);
      const pointerPosition = this.state.pointerPosition;
      const matchesAtPointer = pointerPosition
        ? matchesAt.get(PositionRecord(pointerPosition)) || []
        : [];

      const matchesForWord = this.props.selectedWord
        ? matches.filter((match) => match.word === this.props.selectedWord)
        : [];

      const highlightedMatches = [...matchesAtPointer, ...matchesForWord];

      return (
        <div
          className={styles.grid}
          onPointerLeave={() => this.setState({ pointerPosition: undefined })}
        >
          <PuzzleNodes
            usePaintWorklet={false}
            nodes={getNodes(this.props.rows, this.props.words)}
            onSelect={this.onSelect}
          />

          {highlightedMatches.map((match) => (
            <PuzzleGridHighlight
              key={`${match.start.rowIdx}:${match.start.colIdx}:${match.end.rowIdx}:${match.end.colIdx}`}
              start={match.start}
              end={match.end}
            />
          ))}
        </div>
      );
    }
  }
}

export default Puzzle;
