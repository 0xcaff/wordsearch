import React from 'react';
import './Button.css';

const ToggleButton = ({ onChange, active, children }) => {
  const id =
    Math.floor(Math.random() * 0x10000)
      .toString(16);

  return (
    <span className='ToggleButton'>
      <input
        id={id}
        type='checkbox'
        checked={active}
        onChange={(e) => onChange(e.target.checked)} />

      <label
        htmlFor={id}
        className='Button'>

        { children }
      </label>
    </span>
  );
};


export default ToggleButton;
