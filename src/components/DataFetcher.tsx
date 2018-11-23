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
  prevId?: string;
  isLoading: boolean;
  isFromLocal: boolean;
  data: PuzzleData | null;
}

type ChildProps =
  | { isLoading: true }
  | { isLoading: false; isFromLocal: boolean; data: PuzzleData };

class DataFetcher extends Component<Props, State> {
  _currentId: string | null = null;

  state: State = {
    isLoading: true,
    data: null,
    isFromLocal: false
  };

  static getDerivedStateFromProps(nextProps: Props, prevState: State) {
    if (nextProps.data) {
      return {
        isLoading: false,
        data: nextProps.data,
        isFromLocal: true
      };
    }

    if (nextProps.id && nextProps.id !== prevState.prevId) {
      return {
        isLoading: true,
        data: null,
        isFromLocal: false,
        prevId: nextProps.id
      };
    }

    if (!nextProps.id && !nextProps.data) {
      return {
        isLoading: false,
        data: null,
        isFromLocal: true
      };
    }

    return null;
  }

  componentDidMount() {
    if (this.props.id) {
      this.loadAsync(this.props.id);
    }
  }

  componentDidUpdate() {
    if (
      this.props.id &&
      this.props.id === this.state.prevId &&
      this.state.data === null
    ) {
      this.loadAsync(this.props.id);
    }
  }

  componentWillUnmount() {
    this._currentId = null;
  }

  loadAsync = (id: string) => {
    if (id === this._currentId) {
      return;
    }

    this._currentId = id;

    database.getPuzzle(id).then(data => {
      // Only update state if the Promise that has just resolved,
      // Reflects the most recently requested external data.
      if (id === this._currentId) {
        this.setState({ isLoading: false, data });
      }
    });
  };

  render() {
    if (this.state.isLoading) {
      return this.props.children({ isLoading: true });
    }

    if (this.state.data === null) {
      return <div className={styles.notFound}>Not Found :(</div>;
    }

    return this.props.children({
      isLoading: false,
      data: this.state.data,
      isFromLocal: this.state.isFromLocal
    });
  }
}

export default DataFetcher;
