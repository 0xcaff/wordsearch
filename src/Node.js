import React, { Component } from 'react';
import './Node.css';

// TODO: Implement scu

// TODO: onMouseLeave from selection can trigger an onMouseEnter here causing
// the mouse to not be over but the selection to stay selected.
export default class Node extends Component {
  render() {
    console.log("Node.render");

    const { node, x, y, mouseEnterNode } = this.props;

    return (
      <div
        className={[
          "Node",
          node.partOf.length && 'partOf',
        ].filter(t => !!t).join(' ')}

        style={{
          gridColumnStart: x + 1,
          gridRowStart: y + 1,
        }}

        onMouseEnter={_ => mouseEnterNode(node)}>

          <div>
            <span>{node.khar}</span>
          </div>
      </div>
    );
  }
}

