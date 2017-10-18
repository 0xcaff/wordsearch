import { withRouter } from 'react-router'
import './snippet';

const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
  window.analytics.debug();
}

export default withRouter(({ location, history }) => {
  if (process.env.NODE_ENV === 'test') {
    return null;
  }

  // Track Current Page
  window.analytics.page({
    isDev,
    path: location.pathname,
  });

  return null;
});
