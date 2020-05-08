import React from "react";
import listStyles from "./List.module.css";
import styles from "./WordList.module.css";

interface Word {
  /**
   * The word.
   */
  word: string;

  /**
   * Whether or not the word is focused. Focused elements are highlighted with an orange background.
   */
  isFocused: boolean;
}

interface Props {
  /**
   * Words to display in the list.
   */
  words: Word[];

  /**
   * Called when a word is moused over or focused.
   * @param word The word which was focused.
   */
  onSelectWord: (word: string) => void;

  /**
   * Called when a the mouse leaves a word or a word is unfocused.
   * @param word The word which was unfocused.
   */
  onUnSelectWord: (word: string) => void;
}

const WordList = (props: Props) => (
  <div>
    <h3 className={styles.header}>Words</h3>

    <div>
      <div className={[listStyles.list, listStyles.static].join(" ")}>
        <ul>
          {props.words.map((item, idx) => (
            <li
              key={idx}
              onPointerEnter={() => props.onSelectWord(item.word)}
              onPointerLeave={() => props.onUnSelectWord(item.word)}
              onFocus={() => props.onSelectWord(item.word)}
              onBlur={() => props.onUnSelectWord(item.word)}
              className={[listStyles.listItem, item.isFocused && styles.focused]
                .filter((i) => !!i)
                .join(" ")}
              tabIndex={0}
            >
              <span className={listStyles.listItemContent}>{item.word}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  </div>
);

export default WordList;
