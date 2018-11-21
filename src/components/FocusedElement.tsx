import React from 'react';
import styles from './FocusedElement.module.css';

interface Props {
  children: React.ReactNode,
}

const FocusedElement = (props: Props) => {
  return (
    <div className={styles.focused}>
      {props.children}
    </div>
  );
};

export default FocusedElement;

interface FocusedWrapperProps {
  focused: boolean;
  children: React.ReactNode,
}

export const FocusedWrapper = (props: FocusedWrapperProps) => {
  if (props.focused) {
    return <FocusedElement>{props.children}</FocusedElement>
  } else {
    return <>{props.children}</>
  }
};
