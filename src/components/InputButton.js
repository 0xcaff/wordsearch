import React from 'react';
import './Button.css';

const ButtonInput = (props) =>
  <label
    className='ButtonInput Button'>
    { props.children }

    <input
      type='file'
      {...(
        Object.entries(props)
          .filter(([key, value]) => key !== 'children')
          .reduce((acc, [key, value]) => Object.assign(acc, { [key]: value }), {})
      )} />
  </label>

export default ButtonInput;
