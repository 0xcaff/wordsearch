import React from "react";
import styles from "./Button.module.css";

interface Props {
  onClick: () => void;
  className?: string;
  children: React.ReactNode;
}

const Button = (props: Props) => (
  <span
    className={[styles.button, props.className].join(" ")}
    onClick={props.onClick}
  >
    {props.children}
  </span>
);

export default Button;
