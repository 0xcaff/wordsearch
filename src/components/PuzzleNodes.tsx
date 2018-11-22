import React, {memo} from 'react';
import { Position } from "./Puzzle";
import PuzzleNode from "./PuzzleNode";

interface Props {
  rows: string[],
  onSelect: (selected: Position) => void,
}

const PuzzleNodes = memo((props: Props) =>
  <>
    {props.rows.flatMap(
    (row, rowIdx) => row.split('').map(
      (col, colIdx) =>
        <PuzzleNode
          key={keyOf(rowIdx, colIdx, col)}
          onEnter={() => props.onSelect({ rowIdx, colIdx })}
          content={col}
          rowIdx={rowIdx}
          colIdx={colIdx}/>
    )
  )}
  </>
);

const keyOf = (rowIdx: number, colIdx: number, col: string): string =>
  `${rowIdx}:${colIdx}:${col}`;

export default PuzzleNodes;
