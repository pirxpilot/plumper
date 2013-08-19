var math = require('./math');
var rect = require('./rect');

module.exports = grid;

function grid(extent) {
	var my = {
		extent: extent.slice(),
		cells: []
	}, self = {};


	function get(cell) {
		return my.cells[cell[0]][cell[1]];
	}

	function set(cell) {
		my.cells[cell[0]][cell[1]] = 1;
	}

	function markCells(polyline) {
		var i;
		if (polyline.length === 1) {
			set(polyline[0]);
			return;
		}
		for (i = 1; i < polyline.length; i++) {
			plot(polyline[i - 1], polyline[i]);
		}
	}

	function valid(cell) {
		return cell[0] >= 0
			&& cell[1] >= 0
			&& cell[0] < my.extent[0]
			&& cell[1] < my.extent[1];
	}

	function markNeighbors(cell) {
		[
			[-1, -1], [-1, 0], [-1, 1],
			[ 0, -1],          [ 0, 1],
			[ 1, -1], [ 1, 0], [ 1, 1]
		].forEach(function(d) {
			var neighbor = math.offset(cell, d);
			if (valid(neighbor)) {
				set(neighbor);
			}
		});
	}

	function forEach(fn, flip) {
		var x, y, columns, rows;
		if (flip) {
			columns = my.extent[1];
			rows = my.extent[0];
		} else {
			columns = my.extent[0];
			rows = my.extent[1];
		}
		for (y = 0; y < rows; y += 1) {
			for (x = 0; x < columns; x += 1) {
				fn(flip ? [y, x] : [x, y]);
			}
		}
	}

	function forEachValue(fn, flip) {
		forEach(function(cell) {
			fn(get(cell), cell);
		}, flip);
	}

	function filter(fn) {
		var result = [];
		fn = fn || get;
		forEach(function(cell) {
			if (fn(cell)) {
				result.push(cell);
			}
		});
		return result;
	}

	function createCells() {
		var x, y, row, cells = [];
		for(x = 0; x < my.extent[0]; x++) {
			row = cells[x] = [];
			for(y = 0; y < my.extent[1]; y++) {
				row[y] = 0;
			}
		}
		return cells;
	}

	function addNeighbors() {
		filter().forEach(function(cell) {
			markNeighbors(cell);
		});
	}

	function lastCell(cell, flip) {
		var i = flip ? 1 : 0;
		return cell[i] + 1 === my.extent[i];
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

	function calculateBoxes() {
		var horizontal = findBoxes(false),
			vertical = findBoxes(true),
			result;

		result = horizontal.length <= vertical.length ? horizontal : vertical;
		return result.map(function(r) {
			return r.box();
		});
	}

	// see: Bresenham's line algorithm
	function plot(start, end) {
		var d, s, err, e2, point;
		d = [
			end[0] - start[0],
			end[1] - start[1]
		];
		s = d.map(math.sign);
		d = d.map(Math.abs);
		point = start.slice();
		err = d[0] - d[1];
		while(true) {
			set(point);
			if (math.same(point, end)) {
				return;
			}
			e2 = 2 * err;
			if (e2 > -d[1]) {
				err -= d[1];
				point[0] += s[0];
			}
			if (math.same(point, end)) {
				set(point);
				return;
			}
			if (e2 < d[0]) {
				err += d[0];
				point[1] += s[1];
			}
		}
	}

	function fatten(polyline) {
		markCells(polyline);
		addNeighbors();
		return calculateBoxes();
	}

	my.cells = createCells();
	self.fatten = fatten;
	self.findBoxes = findBoxes;
	self.forEach = forEach;
	self.filter = filter;
	self.plot = plot;
	self.addNeighbors = addNeighbors;
	self.set = set;

	return self;
}