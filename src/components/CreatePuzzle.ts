import React from "react";
import { PuzzleData } from "../database";
import { database } from "../database";
import { useWithLoading } from "./useWithLoading";

interface Props {
  onCreated: (id: string) => void;
  children: (props: ChildProps) => React.ReactElement;
}

interface ChildProps {
  create: (puzzle: PuzzleData) => void;
  isCreating: boolean;
}

export const CreatePuzzle: React.FC<Props> = (props: Props) => {
  const { load, isLoading } = useWithLoading(async (puzzle: PuzzleData) => {
    const newPuzzle = await database.newPuzzle(puzzle);
    props.onCreated(newPuzzle.id);
  });

  return props.children({
    create: load,
    isCreating: isLoading
  });
};

export default CreatePuzzle;
