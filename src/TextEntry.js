import React, { Component } from 'react';
import './TextEntry.css'

// TODO: The sizing for this is broken in chrome because chrone doesn't account
// for letter-spacing in the line-width.

export default class TextEntry extends Component {
  constructor(props) {
    super(props);

    this.handleText = this.handleText.bind(this);
  }

  handleText(event) {
    const textEntry = event.target.value;
    this.props.onChange(textEntry);
  }

  render() {
    const { minimumRows, minimumColumns, value, placeholder } = this.props;
    const rows = value.split(/\r?\n/);

    let mostCols = rows.reduce((acc, val) => {
        if (val.length > acc) {
          return val.length;
        }

        return acc;
      }, 0);

    if (mostCols < minimumColumns) {
      mostCols = minimumColumns;
    }

    let rowsCount = rows.length;
    if (rowsCount < minimumRows) {
      rowsCount = minimumRows;
    }

    return (
      <div className='TextEntry'>
        <textarea
          value={value}
          cols={mostCols}
          rows={rowsCount}
          onChange={this.handleText}
          placeholder={placeholder}
          spellCheck={false} />
      </div>
    );
  }
}

