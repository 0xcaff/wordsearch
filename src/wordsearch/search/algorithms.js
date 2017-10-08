import { findMatches as findMatchesBruteForce } from './force';
import { findMatches as findMatchesPrefixTable } from './prefix';

export default [
  { name: 'brute force', f: findMatchesBruteForce },
  { name: 'prefix table', f: findMatchesPrefixTable },
];
