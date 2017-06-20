import React, { Component } from 'react';
import './Node.css';

export default class Node extends Component {
  constructor(props) {
    super(props);

    this.state = this.handleNewProps(props);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(this.handleNewProps(nextProps));
  }

  handleNewProps(nextProps) {
    // Take prop changes and turn them into state changes.
    return {
      isMarked: !!nextProps.node.marked,
      partOf: nextProps.node.partOf,
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    // The only state which can change after the initial render is the marked
    // state and whether this node is part of a match.

    return this.state.isMarked !== nextState.isMarked ||
      this.state.partOf !== nextState.partOf;
  }

  // Changes the state of nodes of matches this node is part of and updates the
  // parent.
  markMatches(to) {
    if (this.state.partOf.length <= 0) {
      return;
    }

    console.log("Marking to", to);

    let somethingChanged;
    for (const match of this.state.partOf) {
      for (const node of match) {
        if (node.marked === to) {
          // nop
          continue
        }

        // update
        node.marked = to;
        if (!somethingChanged) {
          somethingChanged = true;
        }
      }
    }

    if (somethingChanged) {
      this.props.updateNodes();
    }
  }

  render() {
    console.log("Node.render");

    return (
      <div
        className={[
          "Node",
          this.state.partOf.length && 'partOf',
          this.state.isMarked && 'marked'
        ].filter(t => !!t).join(' ')}

        onMouseEnter={_ => this.markMatches(true)}
        onMouseLeave={_ => this.markMatches(false)}

        style={{
          gridColumnStart: this.props.x + 1,
          gridRowStart: this.props.y + 1,
        }}>
          <div>
            <span>{this.props.node.khar}</span>
          </div>
      </div>
    );
  }
}

