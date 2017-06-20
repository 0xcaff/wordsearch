import React, { Component } from 'react';
import './TextEntry.css'

export default class TextEntry extends Component {
  state = {
    // The value of the stuff in the textare used for inputting a wordsearch.
    textEntry: '',
  };

  constructor(props) {
    super(props);

    // For some reason, even though the only way to mutate state in the
    // constructor is by mutating it directly, this lint doesn't let us.

    /* eslint-disable react/no-direct-mutation-state */
    this.state.columns = this.props.minimumColumns;
    this.state.rows = this.props.minimumRows;
    this.state.textEntry = this.props.value;
    /* eslint-enable */

    this.handleText = this.handleText.bind(this);
  }

  handleText(event) {
    const textEntry = event.target.value;
    this.props.onChange(textEntry);
    this.setState({textEntry: textEntry});
  }

  render() {
    console.log("TextEntry.render");
    const rows = this.state.textEntry.split(/\r?\n/);
    const { minimumRows, minimumColumns } = this.props;

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
          value={this.state.textEntry}
          cols={mostCols}
          rows={rowsCount}
          onChange={this.handleText}
          spellCheck={false} />
      </div>
    );
  }
}

