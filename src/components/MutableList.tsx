import React, { useCallback } from "react";
import styles from "./List.module.css";

interface Props {
  items: string[];
  children: (item: string) => React.ReactNode;
  onChange: (newItems: string[]) => void;
}

const MutableList = ({ items, onChange, children }: Props) => {
  const removeItem = useCallback(
    (idx: number) => {
      const newItems = [...items.slice(0, idx), ...items.slice(idx + 1)];
      onChange(newItems);
    },
    [items, onChange]
  );

  const addItems = useCallback(
    (...newItems: string[]) => onChange(items.concat(newItems)),
    [items, onChange]
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();

      const lines = event.clipboardData.getData("text/plain").split(/\r?\n/);
      addItems(...lines);
    },
    [addItems]
  );

  const handleKeyPress = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      if (event.key !== "Enter") {
        // ignore everything except enter key without shift
        return;
      }

      const value = event.currentTarget.value;
      if (value === "") {
        return;
      }

      event.currentTarget.value = "";
      addItems(value);
    },
    [addItems]
  );

  return (
    <div className={styles.list}>
      <ul>
        {items.map((item, idx) => (
          <li key={idx} className={styles.listItem}>
            <span className={styles.listItemContent}>
              {children(item)}

              <span
                onClick={() => removeItem(idx)}
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
            onPaste={handlePaste}
            onKeyPress={handleKeyPress}
            type="Text"
            placeholder="Enter Word..."
          />
        </li>
      </ul>
    </div>
  );
};

export default MutableList;
