import React from "react";
import styles from "./Loading.module.css";
import sharedStyles from "./shared.module.css";

const Loading = () => (
  <svg width="500" height="250" viewBox="-250 -125 500 250">
    <text x="0" y="0" className={styles.loadingText}>
      Loading...
    </text>
  </svg>
);

export const FullPageLoading = () => (
  <div className={sharedStyles.centered}>
    <Loading />
  </div>
);

export default Loading;
