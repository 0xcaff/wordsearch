import React, { Component } from 'react';
import './List.css';

export default class List extends Component {
  state = {
    // The items held and displayed.
    items: [],
  };

  constructor(props) {
    super(props);

    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.items = this.props.items || this.state.items;

    this.handleEntryKeyPress = this.handleEntryKeyPress.bind(this);
    this.handlePaste = this.handlePaste.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.items !== nextState.items || this.props.focused !== nextProps.focused;
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
    const oldItems = this.state.items;

    // collect only new items
    const filteredItems = items
      .filter(item => !oldItems.includes(item));

    const newItems = oldItems.concat(filteredItems);
    this.setState({items: newItems});
    this.props.onChange(newItems);
  }

  render() {
    console.log("List.render")

    const { itemProps, focused } = this.props;

    return (
      <div
        className="List">
        <ul>
          { this.state.items.map(item =>
            <li
              {...itemProps(item)}
              ref={focused[0] === item ? (elem => elem && elem.scrollIntoView({behavior: 'smooth'})) : undefined }
              className={[focused.includes(item) && 'focused'].filter(e => !!e).join(' ')}
              key={item}>
                {item}
            </li>
          ) }

          <li
            className="Input"
            key=""
            title='Enter Word or Paste Newline Separated Words'>
            <input
              onPaste={this.handlePaste}
              onKeyPress={this.handleEntryKeyPress}
              type='text'
              placeholder='Enter Word or Paste Newline Separated Words' />
          </li>
        </ul>
      </div>
    );
  }
}

