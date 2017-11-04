import React from 'react';
import { inputButton, button } from './Button.css';

const ButtonInput = ({ children, className, onChange }) => {
  return (
    <label
      className={[className, inputButton, button].join(' ')}>
      { children }

      <input
        type='file'
        onChange={onChange} />
    </label>
  );
}

export default ButtonInput;
