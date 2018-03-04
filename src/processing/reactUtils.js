import React from "react";

export const unique = elems =>
  elems.map((e, i) => React.cloneElement(e, { key: i }));
