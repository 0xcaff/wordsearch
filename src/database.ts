import firebase from "firebase";
import { firestore } from "./firebase";

export const puzzleCollectionName = "puzzles";

export interface PuzzleWithId extends PuzzleData {
  id: string;
}

export interface PuzzleData {
  rows: string[];
  words: string[];
}

export interface Database {
  getPuzzle(id: string): Promise<PuzzleWithId | null>;
  newPuzzle(data: PuzzleData): Promise<PuzzleWithId>;
}

class FirebaseDatabase implements Database {
  private db: firebase.firestore.Firestore;

  constructor(firestore: firebase.firestore.Firestore) {
    this.db = firestore;
  }

  async getPuzzle(id: string): Promise<PuzzleWithId | null> {
    const doc = await this.db.collection(puzzleCollectionName).doc(id).get();

    const data = doc.data();
    if (!data) {
      return null;
    }

    return { id: doc.id, ...(data as PuzzleData) };
  }

  async newPuzzle(data: PuzzleData): Promise<PuzzleWithId> {
    const docRef = await this.db.collection(puzzleCollectionName).add(data);
    return { id: docRef.id, ...data };
  }
}

export const database = new FirebaseDatabase(firestore);
