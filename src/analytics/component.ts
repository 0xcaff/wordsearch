import { withRouter } from "react-router-dom";
import "./snippet";

const isDev = process.env.NODE_ENV === "development";
if (isDev) {
  (window as any).analytics.debug();
}

export default withRouter((props) => {
  if (process.env.NODE_ENV === "test") {
    return null;
  }

  // Track Current Page
  (window as any).analytics.page({
    isDev,
    path: props.location.pathname,
  });

  return null;
});
