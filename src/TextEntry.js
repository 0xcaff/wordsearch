import React, { Component } from 'react';
import './TextEntry.css'

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
    console.log("TextEntry.render");

    const { minimumRows, minimumColumns, value } = this.props;
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
          spellCheck={false} />
      </div>
    );
  }
}

