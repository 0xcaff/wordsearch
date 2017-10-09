import React from 'react';
import './Button.css';

import { randomHex } from '../processing/utils';

const ToggleButton = ({ onChange, active, children }) => {
  const id = randomHex();

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
