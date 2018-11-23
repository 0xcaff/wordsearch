import firebase from "firebase";
import { Database, PuzzleData, PuzzleWithId } from "./database";

firebase.initializeApp({
  apiKey: "AIzaSyDVyydEEzAXaSJxVj3Aj583d5rcNDdSpLI",
  authDomain: "wordsearch-172001.firebaseapp.com",
  databaseURL: "https://wordsearch-172001.firebaseio.com",
  projectId: "wordsearch-172001",
  storageBucket: "wordsearch-172001.appspot.com",
  messagingSenderId: "686396208177"
});

const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

class FirebaseDatabase implements Database {
  private db: firebase.firestore.Firestore;

  constructor(firestore: firebase.firestore.Firestore) {
    this.db = firestore;
  }

  async getPuzzle(id: string): Promise<PuzzleWithId | null> {
    const doc = await this.db
      .collection("puzzles")
      .doc(id)
      .get();

    const data = doc.data();
    if (!data) {
      return null;
    }

    return { id: doc.id, ...(data as PuzzleData) };
  }

  async newPuzzle(data: PuzzleData): Promise<PuzzleWithId> {
    const docRef = await this.db.collection("puzzles").add(data);
    return { id: docRef.id, ...data };
  }
}

export const database = new FirebaseDatabase(firestore);
