import React from 'react';
import listStyles from './List.module.css';
import styles from './WordList.module.css';
import Button from "./Button";
import {FocusedWrapper} from "./FocusedElement";

interface Word {
  word: string,
  isFocused: boolean,
}

interface Props {
  words: Word[],
  onBack: () => void,
}

const WordList = (props: Props) =>
  <div>
    <h3 className={styles.header}>Words</h3>

    <div>
      <div className={listStyles.list}>
        <ul>
          {props.words.map((item, idx) =>
            <li
              key={idx}
              className={listStyles.listItem}
              tabIndex={0}
            >
              <FocusedWrapper focused={item.isFocused}>
                <span
                  className={listStyles.listItemContent}>
                  {item.word}
                </span>
              </FocusedWrapper>
            </li>
          )}
        </ul>
      </div>

      <Button className={styles.backButton} onClick={props.onBack}>
        Edit
      </Button>
    </div>
  </div>;

export default WordList;

