import React from "react";
import { button } from "./Button.css";

const Button = ({ onClick, className, children }) => (
  <span className={[button, className].join(" ")} onClick={onClick}>
    {children}
  </span>
);

export default Button;
