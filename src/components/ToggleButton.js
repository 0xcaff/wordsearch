import React from 'react';
import { toggleButton } from './Button.module.css';

import { randomHex } from '../processing/utils';

const ToggleButton = ({ onChange, active, children, className }) => {
  const id = randomHex();

  return (
    <span className={[ className, toggleButton ].join(' ')}>
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
