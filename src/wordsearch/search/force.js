// A brute force algorithm for finding the solutions of a wordsearch. The worst
// case complexity of this algorithm is O(n * w * l) where n is the number of
// nodes in the graph, w is the number of words we are searching for and l is
// the average length of the word we are searching for.
export function findMatches(words, grid, directions) {
  const matches = {
    // word: [
    //     [nodes],
    //     [nodes],
    // ],
  };

  const cols = grid.columns();
  const rows = grid.rows();

  // travarse graph once for each word
  for (const word of words) {
    for (let x = 0; x < cols; x++) {
      for (let y = 0; y < rows; y++) {
        const node = grid.get(x, y);
        if (!node) {
          // no node here
          continue;
        }

        for (const { displacement: { x: dx, y: dy } } of directions) {
          // look at every direction of every node

          const discoveredWord = [];
          
          for (
            let index = 0, cx = x, cy = y;
            index < word.length;
            index++, cx += dx, cy += dy
          ) {
            const currentNode = grid.get(cx, cy);

            // check whether this node continues the sequence
            if (!currentNode || currentNode.value !== word[index]) {
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
            continue;
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
  }

  return matches;
};
