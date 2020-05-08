import React from "react";
import styles from "./PuzzleNode.module.css";

interface Props {
  rowIdx: number;
  colIdx: number;
  content: string;
  isHighlighted: boolean;
  usePaintWorklet: boolean;

  onEnter: () => void;
}

const PuzzleNode = (props: Props) => (
  <div
    className={[
      styles.container,
      !props.usePaintWorklet && styles.withoutPaintWorklet,
      props.isHighlighted && styles.highlighted,
    ]
      .filter((d) => !!d)
      .join(" ")}
    style={{
      gridColumnStart: props.colIdx + 1,
      gridRowStart: props.rowIdx + 1,
    }}
    onPointerEnter={props.onEnter}
  >
    <div className={styles.inner}>{props.content}</div>
  </div>
);

export default PuzzleNode;
