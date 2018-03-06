import React, { Component } from 'react';
import {
  node as nodeClass, partOf as partOfClass, container as containerClass,
  content as contentClass,
} from './Node.css';

export default class Node extends Component {
  render() {
    const { node, x, y, mouseEnterNode } = this.props;

    return (
      <div
        className={[
          nodeClass,
          node.partOf.length && partOfClass,
        ].filter(t => !!t).join(' ')}

        style={{
          gridColumnStart: x + 1,
          gridRowStart: y + 1,
        }}

        onMouseEnter={_ => mouseEnterNode(node)}>

          <div className={containerClass}>
            <span className={contentClass}>{node.value}</span>
          </div>
      </div>
    );
  }
}

