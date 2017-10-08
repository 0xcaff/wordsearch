export function findMatches(words, grid, directions) {
  const matches = {
    // word: [
    //     [nodes],
    //     [nodes],
    // ],
  };

  const cols = grid.columns();
  const rows = grid.rows();

  const prefixLength = Math.min(
    words
      .map(d => d.length)
      .reduce((a, b) => Math.min(a, b), Infinity),
    5,
  );

  const prefixTable = new Map();

  // build prefix table
  for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
      const node = grid.get(x, y);
      if (!node) {
        // no node here
        continue;
      }

      for (const { displacement: { x: dx, y: dy } } of directions) {
        // look at every direction of every node

        const prefixNodes = [];

        for (
          let index = 0, cx = x, cy = y;
          index < prefixLength;
          index++, cx += dx, cy += dy
        ) {
          const currentNode = grid.get(cx, cy);

          // check whether this node continues the sequence
          if (!currentNode) {
            // match failed, try next
            break;
          }

          // it matches, add to discovered
          prefixNodes.push(currentNode);
        }

        // we can be here in two possible states:
        // * hit an empty spot and the prefix isn't complete
        // * a complete match was found
  
        if (prefixNodes.length < prefixLength) {
          // incomplete prefix
          continue;
        }

        const prefix = prefixNodes.map(node => node.value).join('');

        // a complete prefix was found, record it
        if (!prefixTable.has(prefix)) {
          prefixTable.set(prefix, []);
        }

        const prefixTableEntries = prefixTable.get(prefix);
        prefixTableEntries.push(prefixNodes);
      }
    }
  }

  for (const word of words) {
    const prefixKey = word.substring(0, prefixLength);
    const prefixes = prefixTable.get(prefixKey);

    // If the word shorter than the prefix, no match is found.

    for (const prefix of prefixes) {
      const [ firstNode, secondNode ] = prefix;

      const { x: fx, y: fy } = grid.positionOf(firstNode);
      const { x: sx, y: sy } = grid.positionOf(secondNode);

      const dx = sx - fx;
      const dy = sy - fy;

      const possibleMatch = [];

      for (
        let index = 0, cx = fx, cy = fy;
        index < word.length;
        index++, cx += dx, cy += dy
      ) {
        const currentNode = grid.get(cx, cy);

        // check whether this node continues the sequence
        if (!currentNode || currentNode.value !== word[index]) {
          // match failed, try next
          break;
        }

        possibleMatch.push(currentNode);
      }

      // we can be here in two possible states:
      // * an incomplete match was found
      // * a complete match was found

      if (word.length <= 0 || word.length !== possibleMatch.length) {
        continue;
      }

      // record match
      if (!matches[word]) {
        matches[word] = [];
      }

      const discoveredWordArray = [ possibleMatch ];
      matches[word] = matches[word].concat(possibleMatch);

      for (const node of possibleMatch) {
        node.partOf = node.partOf.concat(discoveredWordArray);
      }
    }
  }

  return matches;
};
