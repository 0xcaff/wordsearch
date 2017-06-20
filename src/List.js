import React, { Component } from 'react';

// TODO: Bulk input
export default class List extends Component {
  state = {
    items: [],
  };

  constructor(props) {
    super(props);

    // eslint-disable-next-line react/no-direct-mutation-state
    this.state.items = this.props.items || this.state.items;

    this.handleEntryKeyPress = this.handleEntryKeyPress.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.items !== nextState.items;
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

    const items = this.state.items.concat(value);
    this.setState({items: items});
    this.props.onChange(items);
  }

  render() {
    console.log("List.render")

    return (
      <div
        className="List">
        <ul>
          {this.state.items.map(item =>
            <li
              {...this.props.itemProps(item)}
              key={item}>
                {item}
            </li>
          ) }

          <li key="">
            <input
              onKeyPress={this.handleEntryKeyPress}
              type='text' />
          </li>
        </ul>
      </div>
    );
  }
}

