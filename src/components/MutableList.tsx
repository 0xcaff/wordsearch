import React, { Component } from "react";
import styles from "./List.module.css";

interface Props {
  items: string[];
  children: (item: string) => React.ReactNode;
  onChange: (newItems: string[]) => void;
}

class MutableList extends Component<Props> {
  private removeItem = (idx: number) => {
    const items = this.props.items;
    const newItems = [...items.slice(0, idx), ...items.slice(idx + 1)];
    this.props.onChange(newItems);
  };

  private addItems = (...items: string[]) =>
    this.props.onChange(this.props.items.concat(items));

  private handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();

    const lines = event.clipboardData.getData("text/plain").split(/\r?\n/);
    this.addItems(...lines);
  };

  private handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter") {
      // ignore everything except enter key without shift
      return;
    }

    const value = event.currentTarget.value;
    if (value === "") {
      return;
    }

    event.currentTarget.value = "";
    this.addItems(value);
  };

  render() {
    return (
      <div className={styles.list}>
        <ul>
          {this.props.items.map((item, idx) => (
            <li key={idx} className={styles.listItem}>
              <span className={styles.listItemContent}>
                {this.props.children(item)}

                <span
                  onClick={() => this.removeItem(idx)}
                  className={styles.removeButton}
                >
                  x
                </span>
              </span>
            </li>
          ))}

          <li className={styles.listItem} key={-1} title="Enter Word...">
            <input
              className={styles.listItemInput}
              onPaste={this.handlePaste}
              onKeyPress={this.handleKeyPress}
              type="Text"
              placeholder="Enter Word..."
            />
          </li>
        </ul>
      </div>
    );
  }
}

export default MutableList;
