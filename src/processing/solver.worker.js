/* global self:false */

import { solve } from '../wordsearch';
import { getSingleMessage } from './worker';

async function main() {
  // Get Message
  // eslint-disable-next-line no-restricted-globals
  const [ rows, words ] = await getSingleMessage(self);

  // Do Work
  const result = solve(rows, words);

  // Return Result
  // eslint-disable-next-line no-restricted-globals
  self.postMessage(result);

  // Shutdown
  // eslint-disable-next-line no-restricted-globals
  self.close();
}

main();
