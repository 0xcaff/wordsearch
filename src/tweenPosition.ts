export function* tweenPosition(
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
) {
  let rowIdx = startRow;
  let colIdx = startCol;

  while (rowIdx !== endRow || colIdx !== endCol) {
    yield { rowIdx, colIdx };

    // push by one
    rowIdx = moveTowards(rowIdx, endRow);
    colIdx = moveTowards(colIdx, endCol);
  }

  yield { rowIdx, colIdx };
}

function moveTowards(number: number, towards: number) {
  if (number > towards) {
    number--;
  } else if (number < towards) {
    number++;
  }

  return number;
}
