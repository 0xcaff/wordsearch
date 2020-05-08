import React, { memo } from "react";
import styles from "./PuzzleGridHighlight.module.css";
import { Position } from "wordsearch-algo";
import { tweenPosition } from "../tweenPosition";

interface Props {
  start: Position;
  end: Position;
}

const PuzzleGridHighlight = memo((props: Props) => (
  <>
    {Array.from(
      tweenPosition(
        props.start.rowIdx,
        props.start.colIdx,
        props.end.rowIdx,
        props.end.colIdx
      )
    ).map((position) => (
      <div
        className={styles.highlight}
        key={`${position.rowIdx}:${position.colIdx}`}
        style={{
          gridRowStart: position.rowIdx + 1,
          gridColumnStart: position.colIdx + 1,
        }}
      />
    ))}
  </>
));

export default PuzzleGridHighlight;
