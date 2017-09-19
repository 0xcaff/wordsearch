import { solve } from '../';
import algorithms from './algorithms';
import puzzles from '../data';

algorithms.forEach(({ name, f: findMatches }) => {
  describe(`${name} solver`, () => {
    Object.entries(puzzles)
      .forEach(([name, puzzle]) =>
        it(`should solve the ${name} puzzle`, () => {
          const matches = solve(puzzle, findMatches)

          const { words } = puzzle;
          expect(Object.keys(matches)).toHaveLength(words.length);
        })
      );
  });
});
