const math = require('./math');
const rect = require('./rect');
const makeCells = require('./cells');

module.exports = grid;

function grid(extent) {
  const cells = makeCells(extent[0], extent[1]);

  return {
    fatten,
    findBoxes,
    forEach,
    filter,
    plot,
    addNeighbors,
    set
  };

  function set(cell) {
    cells.set(cell[0], cell[1]);
  }

  function markCells(polyline) {
    if (polyline.length === 1) {
      cells.set(polyline[0][0], polyline[0][1]);
      return;
    }
    let i = polyline.length;
    while (--i) {
      plot(polyline[i - 1], polyline[i]);
    }
  }

  function forEach(fn, flip) {
    let x;
    let y;
    let columns;
    let rows;
    if (flip) {
      columns = extent[1];
      rows = extent[0];
    } else {
      columns = extent[0];
      rows = extent[1];
    }
    for (y = 0; y < rows; y += 1) {
      for (x = 0; x < columns; x += 1) {
        fn(flip ? [y, x] : [x, y]);
      }
    }
  }

  function forEachValue(fn, flip) {
    forEach(cell => fn(cells.get(cell[0], cell[1]), cell), flip);
  }

  function filter() {
    const result = [];
    cells.forEachMarked((x, y) => {
      result.push([x, y]);
    });
    return result;
  }

  function addNeighbors() {
    filter().forEach(cell => cells.markNeighbors(cell[0], cell[1]));
  }

  function lastCell(cell, flip) {
    const i = flip ? 1 : 0;
    return cell[i] + 1 === extent[i];
  }

  function findBoxes(flip) {
    const rectangles = [];
    let current;
    forEachValue((v, cell) => {
      if (v) {
        if (current) {
          current.extend(flip ? [0, 1] : [1, 0]);
        } else {
          current = rect(cell);
        }
      }
      if (current && (!v || lastCell(cell, flip))) {
        // try merging into any of the existing rectangles
        rectangles.forEach(r => {
          if (current && r.merge(current, flip)) {
            current = null;
          }
        });
        // just add a new one
        if (current) {
          rectangles.push(current);
          current = null;
        }
      }
    }, flip);
    return rectangles;
  }

  function calculateBoxes(optimize) {
    let result = findBoxes(false);

    if (optimize) {
      const vertical = findBoxes(true);
      if (vertical.length < result.length) {
        result = vertical;
      }
    }

    return result.map(r => r.box());
  }

  // see: Bresenham's line algorithm
  function plot(start, end) {
    let e2;

    const d = [end[0] - start[0], end[1] - start[1]];
    const s = [math.sign(d[0]), math.sign(d[1])];

    d[0] = Math.abs(d[0]);
    d[1] = Math.abs(d[1]);

    let err = d[0] - d[1];
    const point = [start[0], start[1]];

    while (true) {
      cells.set(point[0], point[1]);
      if (math.same(point, end)) {
        return;
      }
      e2 = 2 * err;
      if (e2 > -d[1]) {
        err -= d[1];
        point[0] += s[0];
      }
      if (math.same(point, end)) {
        cells.set(point[0], point[1]);
        return;
      }
      if (e2 < d[0]) {
        err += d[0];
        point[1] += s[1];
      }
    }
  }

  function fatten(polyline, optimize) {
    markCells(polyline);
    addNeighbors();
    return calculateBoxes(optimize);
  }
}
