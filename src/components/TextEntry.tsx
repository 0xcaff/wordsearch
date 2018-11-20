import React, {useState} from 'react';
import {Editor, EditorState, ContentState, CompositeDecorator, ContentBlock} from 'draft-js';
import styles from './TextEntry.module.css'

interface Props {
  value: string,
  onChange: (newText: string) => void,
  placeholder: string,
}

const TextEntry = React.memo((props: Props) => {
  const [editorState, setEditorState] = useState(() => {
    const decorator = new CompositeDecorator([
        { strategy: eachCharStrategy, component: HandleSpan }
    ]);

    const contentState = ContentState.createFromText(props.value);
    const editorState = EditorState.createWithContent(contentState, decorator);

    return editorState;
  });

  return (
    <div className={styles.editor}>
      <Editor
        placeholder={props.placeholder}
        stripPastedStyles={true}
        editorState={editorState}
        onChange={(editorState) => {
          const contentState = editorState.getCurrentContent();
          props.onChange(contentState.getPlainText());
          setEditorState(editorState);
        }}
        blockStyleFn={blockStyleFn} />
    </div>
  );
});

const blockStyleFn = () => styles.block;

const eachCharStrategy = (contentBlock: ContentBlock, callback: (start: number, end: number) => void) => {
  const text = contentBlock.getText();

  for (let i = 0; i < text.length; i++) {
    callback(i, i + 1);
  }
};

interface HandleSpanProps {
    children: React.ReactNode,
}

const HandleSpan = (props: HandleSpanProps) =>
  <span className={styles.khar}>{ props.children }</span>;

export default TextEntry;
