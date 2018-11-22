import React, { Component } from "react";
import styles from "./DataFetcher.module.css";
import { PuzzleData } from "../database";
import { database } from "../firebase";

interface Props {
  id?: string;
  data?: PuzzleData;
  children: (state: ChildProps) => React.ReactNode;
}

interface State {
  isLoading: boolean;
  data: PuzzleData | null;
}

type ChildProps = { isLoading: true } | { isLoading: false; data: PuzzleData };

class DataFetcher extends Component<Props, State> {
  state: State = {
    isLoading: true,
    data: null
  };

  constructor(props: Props) {
    super(props);

    if (this.props.data) {
      this.state = {
        isLoading: false,
        data: this.props.data
      };
    }
  }

  componentDidMount() {
    if (this.props.id) {
      database
        .getPuzzle(this.props.id)
        .then(data => this.setState({ isLoading: false, data }));
    }
  }

  render() {
    if (this.state.isLoading) {
      return this.props.children({ isLoading: true });
    }

    if (this.state.data === null) {
      return <div className={styles.notFound}>Not Found :(</div>;
    }

    return this.props.children({ isLoading: false, data: this.state.data });
  }
}

export default DataFetcher;
