// A node in a standard character-based word search.
export class CharNode {
  constructor(khar) {
    // The char that this node repersents.
    this.value = khar;

    // An array of matches which this node is a part of. Each match will hold
    // the other nodes which make up the match and some data about the match.
    this.partOf = [];
  }
}
