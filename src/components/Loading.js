import React from "react";

import { loadingText } from "./Loading.css";

const Loading = () => (
  <svg width="500" height="250" viewBox="-250 -125 500 250">
    <text x="0" y="0" className={loadingText}>
      Loading...
    </text>
  </svg>
);

export default Loading;
