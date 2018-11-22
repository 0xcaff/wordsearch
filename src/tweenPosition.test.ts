import { tweenPosition } from "./tweenPosition";

it("should tween in an row line", () => {
  const expected = [
    { row: 0, col: 0 },
    { row: 1, col: 0 },
    { row: 2, col: 0 },
    { row: 3, col: 0 }
  ];

  expectArrayToMatch(Array.from(tweenPosition(0, 0, 3, 0)), expected);

  expectArrayToMatch(
    Array.from(tweenPosition(3, 0, 0, 0)),
    expected.slice().reverse()
  );
});

it("should tween in a col line", () => {
  const expected = [
    { row: 0, col: 0 },
    { row: 0, col: 1 },
    { row: 0, col: 2 },
    { row: 0, col: 3 }
  ];

  expectArrayToMatch(Array.from(tweenPosition(0, 0, 0, 3)), expected);

  expectArrayToMatch(
    Array.from(tweenPosition(0, 3, 0, 0)),
    expected.slice().reverse()
  );

  expectArrayToMatch(
    Array.from(tweenPosition(13, 32, 13, 20)),

    // from {row: 13, col: 20} -> {row: 13, col: 20}
    [...Array(32 - 20 + 1)].map((_, index) => ({ row: 13, col: 32 - index }))
  );
});

it("should tween diagonally down right and up left", () => {
  const expected = [
    { row: 0, col: 0 },
    { row: 1, col: 1 },
    { row: 2, col: 2 },
    { row: 3, col: 3 }
  ];

  expectArrayToMatch(Array.from(tweenPosition(0, 0, 3, 3)), expected);

  expectArrayToMatch(
    Array.from(tweenPosition(3, 3, 0, 0)),
    expected.slice().reverse()
  );
});

it("should tween diagonally up right and down left", () => {
  const expected = [
    { row: 0, col: 3 },
    { row: 1, col: 2 },
    { row: 2, col: 1 },
    { row: 3, col: 0 }
  ];

  expectArrayToMatch(Array.from(tweenPosition(0, 3, 3, 0)), expected);

  expectArrayToMatch(
    Array.from(tweenPosition(3, 0, 0, 3)),
    expected.slice().reverse()
  );
});

function expectArrayToMatch<T>(array: T[], matchingArray: T[]) {
  expect(array).toEqual(matchingArray);
}
