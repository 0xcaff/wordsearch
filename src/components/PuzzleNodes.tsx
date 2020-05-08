import React, { memo } from "react";
import { Position } from "wordsearch-algo";
import PuzzleNode from "./PuzzleNode";

interface Props {
  nodes: Node[];
  usePaintWorklet: boolean;
  onSelect: (selected: Position) => void;
}

export interface Node {
  isHighlighted: boolean;
  position: Position;
  content: string;
}

const PuzzleNodes = memo((props: Props) => (
  <>
    {props.nodes.map((node) => (
      <PuzzleNode
        key={keyOf(node)}
        rowIdx={node.position.rowIdx}
        colIdx={node.position.colIdx}
        content={node.content}
        isHighlighted={node.isHighlighted}
        usePaintWorklet={props.usePaintWorklet}
        onEnter={() => props.onSelect(node.position)}
      />
    ))}
  </>
));

const keyOf = (node: Node): string =>
  `${node.position.rowIdx}:${node.position.colIdx}:${node.content}`;

export default PuzzleNodes;
