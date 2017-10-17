import React, { Component } from 'react';
import './List.css';

export default class List extends Component {
  constructor(props) {
    super(props);

    this.handleEntryKeyPress = this.handleEntryKeyPress.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.props.items !== nextProps.items || this.props.focused !== nextProps.focused;
  }

  handleEntryKeyPress(evt) {
    if (evt.key !== "Enter") {
      // ignore everything except enter key without shift
      return;
    }

    const value = evt.target.value;
    if (value === "") {
      return;
    }

    evt.target.value = "";
    this.addItems(value);
  }

  // A paste handler for bulk input.
  handlePaste(event) {
    event.preventDefault();

    const lines = event.clipboardData
      .getData('text/plain')
      .split(/\r?\n/);

    this.addItems(...lines);
  }

  // A helper method to add items and notify everyone. Returns the added
  // elements.
  addItems(...items) {
    const { onChange, items: oldItems } = this.props;

    // collect only new items
    const filteredItems = items
      .filter(item => !oldItems.includes(item));

    const newItems = oldItems.concat(filteredItems);

    onChange(newItems);
  }

  removeItem(index) {
    const { onChange, items: oldItems } = this.props;

    const newItems = oldItems.slice();
    newItems.splice(index, 1);

    onChange(newItems);
  }

  render() {
    const { focused, items, itemProps = () => null, onChange, scrollFocusedIntoView } = this.props;
    const firstFocused = focused && focused[0];

    return (
      <div
        className={['List', onChange ? 'Updatable' : 'Static'].join(' ')}>
        <ul>
          { items.map((item, i) =>
            <li
              {...itemProps(item)}
              ref={firstFocused === item && scrollFocusedIntoView ?
                (elem => elem && elem.scrollIntoView({ behavior: 'smooth' })) :
                undefined
              }
              className={
                [focused && focused.includes(item) && 'focused']
                  .filter(e => !!e).join(' ')
              }
              key={item}>
                <span>
                  { item }

                  { onChange &&
                    <span
                      onClick={() => this.removeItem(i)}
                      className='Remove'>x</span> }
                </span>
            </li>
          ) }

          { onChange &&
            <li
              className="Input"
              key=""
              title='Enter Word or Paste Newline Separated Words'>
              <input
                onPaste={this.handlePaste}
                onKeyPress={this.handleEntryKeyPress}
                type='text'
                placeholder='Enter Word or Paste Newline Separated Words' />
            </li> }
        </ul>
      </div>
    );
  }
}
