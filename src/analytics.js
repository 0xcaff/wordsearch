import { withRouter } from 'react-router'

const isDev = process.env.NODE_ENV === 'development';
if (isDev) {
  window.analytics.debug();
}

export default withRouter(({ location, history }) => {
  // Track Current Page
  window.analytics.page({
    isDev,
    path: location.pathname,
  });

  return null;
});
