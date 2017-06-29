import React, { Component } from 'react';

export class Canvas extends Component {
  state = {
    context: null,
  };

  // Called when a reference to the canvas element is created or destroyed.
  onRef(elem) {
    let ctx = null;
    if (elem) {
      ctx = elem.getContext('2d');
    };

    this.setState({context: ctx});
  }

  render() {
    const { children } = this.props;
    const { context } = this.state;

    if (context) {
      // start with a clean board
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
    }

    return (
      <div className='Canvas'>
        <StaticCanvas
          onRef={elem => this.onRef(elem)} />

        {context && React.Children.map(children, child => 
          React.cloneElement(child, {context: context})
        )}
      </div>
    );
  }
}

export class Image extends Component {
  render() {
    const { context, image, x = 0, y = 0 } = this.props;

    console.log(image);

    context.drawImage(image, x, y);

    return null;
  }
}

export class Rectangle extends Component {
  render() {
    const { context, x, y, width, height } = this.props;

    context.beginPath();
    context.rect(x, y, width, height);
    context.fill();

    return null;
  }
}

// A static canvas element which can't be changed after the initial render. The
// contents of the contents can be dynamic. This prevents onRef from triggering
// an infinite loop.
class StaticCanvas extends Component {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { onRef } = this.props;

    return (
      <canvas
        ref={elem => onRef(elem)} />
    );
  }
}

