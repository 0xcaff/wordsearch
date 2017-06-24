import { tweenPosition } from './GridSelection';

it('should tween in an x line', () => {
  const expected = [
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: 2, y: 0},
    {x: 3, y: 0},
  ];

  expectArrayToMatch(
    Array.from(tweenPosition(0, 0, 3, 0)),
    expected,
  );

  expectArrayToMatch(
    Array.from(tweenPosition(3, 0, 0, 0)),
    expected.slice().reverse(),
  );
});

it('should tween in a y line', () => {
  const expected = [
    {x: 0, y: 0},
    {x: 0, y: 1},
    {x: 0, y: 2},
    {x: 0, y: 3},
  ];

  expectArrayToMatch(
    Array.from(tweenPosition(0, 0, 0, 3)),
    expected,
  );

  expectArrayToMatch(
    Array.from(tweenPosition(0, 3, 0, 0)),
    expected.slice().reverse(),
  );

  expectArrayToMatch(
    Array.from(tweenPosition(13, 32, 13, 20)),

    // from {x: 13, y: 20} -> {x: 13, y: 20}
    [...Array(32 - 20 + 1)].map((_, index) => ({x: 13, y: 32 - index})),
  );
});

it('should tween diagonally down right and up left', () => {
  const expected = [
    {x: 0, y: 0},
    {x: 1, y: 1},
    {x: 2, y: 2},
    {x: 3, y: 3},
  ];

  expectArrayToMatch(
    Array.from(tweenPosition(0, 0, 3, 3)),
    expected,
  );

  expectArrayToMatch(
    Array.from(tweenPosition(3, 3, 0, 0)),
    expected.slice().reverse(),
  );
});

it('should tween diagonally up right and down left', () => {
  const expected = [
    {x: 0, y: 3},
    {x: 1, y: 2},
    {x: 2, y: 1},
    {x: 3, y: 0},
  ];

  expectArrayToMatch(
    Array.from(tweenPosition(0, 3, 3, 0)),
    expected,
  );

  expectArrayToMatch(
    Array.from(tweenPosition(3, 0, 0, 3)),
    expected.slice().reverse()
  );
});

function expectArrayToMatch(array, matchingArray) {
  array.forEach((elem, index) => expect(elem).toMatchObject(matchingArray[index]));
}
