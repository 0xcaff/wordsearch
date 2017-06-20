// We need a graph with the following properties:
// * allows cycles
//
// * fast to get adjecent nodes
// * fast to visit all nodes
//
// * ok to be slow on additions because we only add to the graph at creation
//   time
// * ok to be slow on deletions because we never delete

// Why use a graph based word search algorithm:
// Pros:
// * It's cool.
// * It can solve the general sequence search problem.
//
// Cons:
// * Defining the graph is harder. Where does it start?
// * How do we visit every node in the graph? What if there are holes separate from the rest of the graph?

// A directed graph using an adjacency map. We need to have information about
// the type of connection so that we can continue to search in the same
// direction. This allows us to solve not only trivial wordsearches
// but also cooler ones with varying adjecent nodes.
export class Node {
  constructor() {
    this.edges = {};
  }

  connectTo(otherNode, edgeName) {
    this.edges[edgeName] = otherNode;
  }

  walk(edgeName) {
    return this.edges[edgeName];
  }

  connectedWith(edgeName) {
    return this.edges.hasOwnProperty(edgeName);
  }
}

