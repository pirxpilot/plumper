export default function cells(columns, rows) {
  const array = new Uint8Array(rows * columns);
  array.fill(0);

  return {
    set,
    get,
    mark,
    valid,
    markNeighbors,
    forEachMarked
  };

  function toIndex(x, y) {
    return x + columns * y;
  }

  function nextCell(cell) {
    cell[0] += 1;
    if (cell[0] >= columns) {
      cell[1] += 1;
      cell[0] = 0;
    }
  }

  function set(x, y) {
    array[toIndex(x, y)] = 1;
  }

  function get(x, y) {
    return array[toIndex(x, y)];
  }

  function valid(x, y) {
    return x >= 0 && y >= 0 && x < columns && y < rows;
  }

  function mark(x, y) {
    if (valid(x, y)) {
      set(x, y);
    }
  }

  function markNeighbors(x, y) {
    mark(--x, --y); // -1, -1
    mark(x, ++y); // -1, 0
    mark(x, ++y); // -1, 1
    mark(++x, y); // 0, 1
    mark(++x, y); // 1. 1
    mark(x, --y); // 1, 0
    mark(x, --y); // 1, -1
    mark(--x, y); // 0, -1
  }

  function forEachMarked(fn) {
    const cell = [0, 0];
    for (const value of array) {
      if (value) {
        fn(cell[0], cell[1]);
      }
      nextCell(cell);
    }
  }
}
