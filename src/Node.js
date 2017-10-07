import React, { Component } from 'react';
import './Node.css';

export default class Node extends Component {
  render() {
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
            <span>{node.value}</span>
          </div>
      </div>
    );
  }
}

