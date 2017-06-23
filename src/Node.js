import React, { Component } from 'react';
import './Node.css';

// TODO: Implement scu
export default class Node extends Component {
  render() {
    console.log("Node.render");

    const { node, x, y } = this.props;

    return (
      <div
        className={[
          "Node",
          node.partOf.length && 'partOf',
        ].filter(t => !!t).join(' ')}

        onMouseEnter={_ => this.props.addMatches(...node.partOf)}
        onMouseLeave={_ => this.props.removeMatches(...node.partOf)}

        style={{
          gridColumnStart: x + 1,
          gridRowStart: y + 1,
        }}>
          <div>
            <span>{node.khar}</span>
          </div>
      </div>
    );
  }
}

