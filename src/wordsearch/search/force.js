// A brute force algorithm for finding the solutions of a wordsearch. The worst
// case complexity of this algorithm is O(n * w * l) where n is the number of
// nodes in the graph, w is the number of words we are searching for and l is
// the average length of the word we are searching for.
export function findMatches(words, nodes, allowedEdges) {
  const matches = {
    // word: [
    //     [nodes],
    //     [nodes],
    // ],
  };

  // travarse graph once for each word
  for (const word of words) {
    // look at every direction of every node
    for (const node of nodes) {
      const potentialDirections = Object.entries(node.edges);
  
      for (const [directionName, ] of potentialDirections) {
        if (!allowedEdges.has(directionName)) {
          // not allowed to traverse this edge, ignore it
          continue;
        }

        const discoveredWord = [];
  
        // loop over the graph and the word and compare
        for (
          let index = 0, currentNode = node;
          index < word.length;
          index++, currentNode = currentNode.edges[directionName]
        ) {
          // check whether this node continues the sequence
          if (!currentNode || !currentNode.matches(word[index])) {
            // match failed, try next
            break;
          }
  
          // it matches, add to discovered
          discoveredWord.push(currentNode);
        }
  
        // we can be here in three possible states:
        // * the word length is zero
        // * there wasn't a match
        // * a complete match was found
  
        if (word.length <= 0 || word.length !== discoveredWord.length) {
          // the word length is zero or there wasn't a match
          continue
        }
  
        // a complete match was found, record match
        if (!matches[word]) {
          matches[word] = [];
        }
  
        const discoveredWordArray = [discoveredWord];
        matches[word] = matches[word].concat(discoveredWordArray);
  
        // add to every node in the word for easy access
        for (const node of discoveredWord) {
          node.partOf = node.partOf.concat(discoveredWordArray);
        }
      }
    }
  }

  return matches;
};
