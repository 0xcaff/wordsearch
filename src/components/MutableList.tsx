import React, { useCallback } from "react";
import styles from "./List.module.css";
import { useTrack } from "../clientAnalyticsEvents";

interface Props {
  items: string[];
  children: (item: string) => React.ReactNode;
  onChange: (newItems: string[]) => void;
}

const MutableList = ({ items, onChange, children }: Props) => {
  const track = useTrack();

  const removeItem = useCallback(
    (idx: number) => {
      track("input:removeWord", {
        removingWordAtIndex: idx,
        totalWordsBeforeRemoving: items.length,
      });

      const newItems = [...items.slice(0, idx), ...items.slice(idx + 1)];
      onChange(newItems);
    },
    [items, onChange, track]
  );

  const addItems = useCallback(
    (...newItems: string[]) => onChange(items.concat(newItems)),
    [items, onChange]
  );

  const handlePaste = useCallback(
    (event: React.ClipboardEvent<HTMLInputElement>) => {
      event.preventDefault();

      const text = event.clipboardData.getData("text/plain");
      const lines = text.split(/\r?\n/);
      track("input:pasteWords", {
        lines: lines.length,
        totalLength: text.length,
      });
      addItems(...lines);
    },
    [addItems, track]
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
      track("input:addWord", { existingWordsCount: items.length });
      addItems(value);
    },
    [addItems, track, items]
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
