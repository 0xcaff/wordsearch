import React from 'react';
import { button } from './Button.css';

const Button = (props) => {
  // TODO: Remove Me and instead make props explicit
  const filteredProps = Object.entries(props)
    .filter(([ key, value ]) => key !== 'className')
    .reduce((acc, [ key, value ]) => Object.assign(acc, { [key]: value }), {});

  return (
    <span
      className={[ button, props.className ].join(' ')}
      {...filteredProps}>
      { props.children }
    </span>
  );
}

export default Button;
