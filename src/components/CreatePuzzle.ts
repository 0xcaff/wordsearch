import React, { Component } from "react";
import { PuzzleData } from "../database";
import { database } from "../firebase";

interface Props {
  onCreated: (id: string) => void;
  children: (props: ChildProps) => React.ReactNode;
}

interface ChildProps {
  create: (puzzle: PuzzleData) => void;
  isCreating: boolean;
}

interface State {
  isLoading: boolean;
}

class CreatePuzzle extends Component<Props, State> {
  mounted: boolean = true;

  state = {
    isLoading: false
  };

  create = async (puzzle: PuzzleData) => {
    if (this.state.isLoading) {
      throw new Error("Multiple mutations happening at the same time!");
    }

    this.setState({ isLoading: true });
    const newPuzzle = await database.newPuzzle(puzzle);
    this.props.onCreated(newPuzzle.id);
    if (this.mounted) {
      this.setState({ isLoading: false });
    }
  };

  componentWillUnmount() {
    this.mounted = false;
  }

  render() {
    return this.props.children({
      create: this.create,
      isCreating: this.state.isLoading
    });
  }
}

export default CreatePuzzle;
