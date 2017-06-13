module.exports = cells;

function cells(columns, rows) {
  var array = new Uint8Array(rows * columns);
  array.fill(0);

  function toIndex(cell) {
    return cell[0] + columns * cell[1];
  }

  function nextCell(cell) {
    cell[0] += 1;
    if (cell[0] >= columns) {
      cell[1] += 1;
      cell[0] = 0;
    }
  }

  function set(cell) {
    array[toIndex(cell)] = 1;
  }

  function get(cell) {
    return array[toIndex(cell)];
  }

  function valid(cell) {
    return cell[0] >= 0
      && cell[1] >= 0
      && cell[0] < columns
      && cell[1] < rows;
  }

  function mark(cell) {
    if (valid(cell)) {
      set(cell);
    }
  }

  function markNeighbors(cell) {
    var x = cell[0], y = cell[1];

    mark([--x, --y]); // -1, -1
    mark([  x, ++y]); // -1, 0
    mark([  x, ++y]); // -1, 1
    mark([++x,   y]); // 0, 1
    mark([++x,   y]); // 1. 1
    mark([  x, --y]); // 1, 0
    mark([  x, --y]); // 1, -1
    mark([--x,   y]); // 0, -1
  }

  function forEachMarked(fn) {
    var cell = [0, 0];
    array.forEach(function(value) {
      if (value) {
        fn([cell[0], cell[1]]);
      }
      nextCell(cell);
    });
  }

  return {
    set: set,
    get: get,
    mark: mark,
    valid: valid,
    markNeighbors: markNeighbors,
    forEachMarked: forEachMarked
  };
}
