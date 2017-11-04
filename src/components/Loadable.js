import Loadable from 'react-loadable';
import Loading from './Loading';

const MyLoadable = (props) =>
  Loadable({
    loading: Loading,
    ...props,
  });

export default MyLoadable;

export const asyncComponent = (loader) => MyLoadable({ loader });
