import React from 'react';
import styles from './PuzzleNode.module.css';

interface Props {
  rowIdx: number,
  colIdx: number,
  content: string,

  onEnter: () => void,
}

const PuzzleNode = (props: Props) =>
  <div
    className={styles.container}
    style={{
      gridColumnStart: props.colIdx + 1,
      gridRowStart: props.rowIdx + 1,
    }}
    onPointerEnter={props.onEnter}
  >
    <div className={styles.inner}>
      {props.content}
    </div>
  </div>;

export default PuzzleNode;
