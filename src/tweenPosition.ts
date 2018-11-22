export function* tweenPosition(
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
) {
  let row = startRow;
  let col = startCol;

  while (row !== endRow || col !== endCol) {
    yield { row: row, col: col };

    // push by one
    row = moveTowards(row, endRow);
    col = moveTowards(col, endCol);
  }

  yield { row, col };
}

function moveTowards(number: number, towards: number) {
  if (number > towards) {
    number--;
  } else if (number < towards) {
    number++;
  }

  return number;
}
