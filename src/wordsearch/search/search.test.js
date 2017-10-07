import { solve } from '../';
import algorithms from './algorithms';
import puzzles from '../data';

algorithms.forEach(({ name, f: findMatches }) => {
  describe(`${name} solver`, () => {
    Object.entries(puzzles)
      .forEach(([name, { words, rows } ]) =>
        it(`should solve the ${name} puzzle`, () => {
          const { matches, grid } = solve(rows, words);

          expect(Object.keys(matches)).toHaveLength(words.length);
        })
      );
  });
});
