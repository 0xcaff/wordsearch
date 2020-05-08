import { tweenPosition } from "./tweenPosition";

it("should tween in an row line", () => {
  const expected = [
    { rowIdx: 0, colIdx: 0 },
    { rowIdx: 1, colIdx: 0 },
    { rowIdx: 2, colIdx: 0 },
    { rowIdx: 3, colIdx: 0 },
  ];

  expectArrayToMatch(Array.from(tweenPosition(0, 0, 3, 0)), expected);

  expectArrayToMatch(
    Array.from(tweenPosition(3, 0, 0, 0)),
    expected.slice().reverse()
  );
});

it("should tween in a col line", () => {
  const expected = [
    { rowIdx: 0, colIdx: 0 },
    { rowIdx: 0, colIdx: 1 },
    { rowIdx: 0, colIdx: 2 },
    { rowIdx: 0, colIdx: 3 },
  ];

  expectArrayToMatch(Array.from(tweenPosition(0, 0, 0, 3)), expected);

  expectArrayToMatch(
    Array.from(tweenPosition(0, 3, 0, 0)),
    expected.slice().reverse()
  );

  expectArrayToMatch(
    Array.from(tweenPosition(13, 32, 13, 20)),

    // from {rowIdx: 13, colIdx: 20} -> {rowIdx: 13, colIdx: 20}
    [...Array(32 - 20 + 1)].map((_, index) => ({
      rowIdx: 13,
      colIdx: 32 - index,
    }))
  );
});

it("should tween diagonally down right and up left", () => {
  const expected = [
    { rowIdx: 0, colIdx: 0 },
    { rowIdx: 1, colIdx: 1 },
    { rowIdx: 2, colIdx: 2 },
    { rowIdx: 3, colIdx: 3 },
  ];

  expectArrayToMatch(Array.from(tweenPosition(0, 0, 3, 3)), expected);

  expectArrayToMatch(
    Array.from(tweenPosition(3, 3, 0, 0)),
    expected.slice().reverse()
  );
});

it("should tween diagonally up right and down left", () => {
  const expected = [
    { rowIdx: 0, colIdx: 3 },
    { rowIdx: 1, colIdx: 2 },
    { rowIdx: 2, colIdx: 1 },
    { rowIdx: 3, colIdx: 0 },
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
