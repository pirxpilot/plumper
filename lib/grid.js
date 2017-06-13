var math = require('./math');
var rect = require('./rect');
var makeCells = require('./cells');

module.exports = grid;


function grid(extent) {
  var cells = makeCells(extent[0], extent[1]);

  function set(cell) {
    cells.set(cell[0], cell[1]);
  }

  function markCells(polyline) {
    if (polyline.length === 1) {
      cells.set(polyline[0][0], polyline[0][1]);
      return;
    }
    var i = polyline.length;
    while(--i) {
      plot(polyline[i - 1], polyline[i]);
    }
  }

  function forEach(fn, flip) {
    var x, y, columns, rows;
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
    forEach(function(cell) {
      fn(cells.get(cell[0], cell[1]), cell);
    }, flip);
  }

  function filter() {
    var result = [];
    cells.forEachMarked(function(x, y) {
      result.push([x, y]);
    });
    return result;
  }

  function addNeighbors() {
    filter().forEach(function(cell) {
      cells.markNeighbors(cell[0], cell[1]);
    });
  }

  function lastCell(cell, flip) {
    var i = flip ? 1 : 0;
    return cell[i] + 1 === extent[i];
  }

  function findBoxes(flip) {
    var rectangles = [], current;
    forEachValue(function(v, cell) {
      if (v) {
        if (current) {
          current.extend(flip ? [0, 1] : [1, 0]);
        } else {
          current = rect(cell);
        }
      }
      if (current && (!v || lastCell(cell, flip))) {
        // try merging into any of the existing rectangles
        rectangles.forEach(function(r) {
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
    var vertical;

    var result = findBoxes(false);

    if (optimize) {
      vertical = findBoxes(true);
      if (vertical.length < result.length) {
        result = vertical;
      }
    }

    return result.map(function(r) {
      return r.box();
    });
  }

  // see: Bresenham's line algorithm
  function plot(start, end) {
    var e2;

    var d = [
      end[0] - start[0],
      end[1] - start[1]
    ];
    var s = [math.sign(d[0]), math.sign(d[1])];

    d[0] = Math.abs(d[0]);
    d[1] = Math.abs(d[1]);

    var err = d[0] - d[1];
    var point = [start[0], start[1]];

    while(true) {
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

  return {
    fatten: fatten,
    findBoxes: findBoxes,
    forEach: forEach,
    filter: filter,
    plot: plot,
    addNeighbors: addNeighbors,
    set: set
  };
}
