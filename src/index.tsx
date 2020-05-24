import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { analyticsThunk } from "./firebase";

analyticsThunk();

ReactDOM.render(<App />, document.getElementById("root"));
