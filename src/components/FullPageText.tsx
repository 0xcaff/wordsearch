import React from "react";
import styles from "./FullPageText.module.css";

interface Props {
  children: React.ReactNode;
}

const FullPageText = (props: Props) => (
  <div className={styles.fullPage}>
    <div>{props.children}</div>
  </div>
);

export default FullPageText;
