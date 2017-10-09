import React from 'react';
import './Button.css';

const Button = (props) =>
  <span
    className='Button'
    {...props}>
    { props.children }
  </span>

export default Button;
