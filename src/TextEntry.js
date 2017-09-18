import React, { Component } from 'react';
import { Editor, EditorState, ContentState, CompositeDecorator } from 'draft-js';

import 'draft-js/dist/Draft.css';
import './TextEntry.css'

export default class TextEntry extends Component {
  constructor(props) {
    super(props);

    const { value } = props;

    const decorator = new CompositeDecorator([
      { strategy: eachCharStrategy, component: HandleSpan }
    ]);

    const contentState = ContentState.createFromText(value);
    const editorState = EditorState.createWithContent(contentState, decorator);

    this.state = { editorState };
    this.onChange = this.onChange.bind(this);
  }

  onChange(editorState) {
    const { onChange } = this.props;

    const contentState = editorState.getCurrentContent();
    onChange(contentState.getPlainText());

    this.setState({ editorState });
  }

  blockStyleFn(contentBlock) {
    return 'Block';
  }

  render() {
    const { editorState } = this.state;
    const { placeholder } = this.props;

    return (
      <div className='TextEntry'>
        <Editor
          placeholder={placeholder}
          stripPastedStyles={true}
          editorState={editorState}
          onChange={this.onChange}
          blockStyleFn={this.blockStyleFn} />
      </div>
    );
  }
}

const eachCharStrategy = (contentBlock, callback, contentState) => {
  const text = contentBlock.getText();

  for (let i = 0; i < text.length; i++) {
    callback(i, i + 1);
  }
};

const HandleSpan = (props) =>
  <span className='Char'>{ props.children }</span>
