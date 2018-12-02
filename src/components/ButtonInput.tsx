import React from "react";
import styles from "./Button.module.css";

interface Props {
  children: React.ReactNode;
  className: string;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const ButtonInput = (props: Props) => (
  <label
    className={[props.className, styles.inputButton, styles.button].join(" ")}
  >
    {props.children}

    <input type="file" onChange={props.onChange} />
  </label>
);

export default ButtonInput;
