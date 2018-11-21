import React from 'react';
import styles from './Puzzle.module.css';
import PuzzleNode from "./PuzzleNode";

interface Props {
  rows: string[],
}

const Puzzle = (props: Props) =>
  <div className={styles.grid}>
    {
      props.rows.flatMap(
        (row, rowIdx) => row.split('').map(
          (col, colIdx) =>
            <PuzzleNode key={keyOf(rowIdx, colIdx, col)} content={col} rowIdx={rowIdx} colIdx={colIdx} />
        )
      )
    }
  </div>

const keyOf = (rowIdx: number, colIdx: number, col: string): string =>
  `${rowIdx}:${colIdx}:${col}`;


export default Puzzle;
