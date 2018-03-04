import React from "react";
import Loadable from "react-loadable";
import Loading from "./Loading";

import { centered } from "./shared.css";

const MyLoadable = props =>
  Loadable({
    loading: () => (
      <div className={centered}>
        <Loading />
      </div>
    ),
    ...props
  });

export default MyLoadable;

export const asyncComponent = loader => MyLoadable({ loader });
