// Tests to ensure finding the grid extracting points from the grid works
// together.

import rbush from 'rbush';
import { findGrid, getPuzzleFromGrid } from './spatialUtils';

// Removes the leading and trailing newline from the output string.
const trim = (str) => {
  const lines = str.split('\n');
  const keptLines = lines.slice(1, -1);
  const output = keptLines.join('\n');

  return output;
}

// The expected output isn't perfect because it contains data obtained by
// recognizing pictures using google cloud vision.
const data = [{
  name: 'cereal',
  nodes: require('./extraction/cereal.json'),
  expected: trim(`
CSQKEJUICENLMILKWFZSBCG
VFM NBANANAZofUUTZPWLNV
 JBPEVPFLETGDRNBFoGSIY 
  VWRTZERKWUBUAHOQHNO  
   YGEUEWEFNV1MNQWRT   
    YFCMMBOOSTNGGOL    
     TQBREAKFASTME     
`),
}];

data.forEach(({ name, nodes, expected }) => {
  it(`should extract the ${name} puzzle correctly`, () => {
    const tree = rbush();
    tree.load(nodes);

    const { avgHeight, avgWidth, xGridLines, yGridLines } = findGrid(nodes.map(node => node.node));
    const outputArray = getPuzzleFromGrid(
      xGridLines, yGridLines, avgWidth, avgHeight, tree);

    const output = outputArray.map(e => e.join('')).join('\n');

    expect(output).toBe(expected);
  });
});
