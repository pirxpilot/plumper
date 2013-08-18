module.exports = grid;


function div(a, b) {
	return Math.floor(a / b); // we only have positive a and b
}

function computeExtent(a, b, size) {
	var mid = (b - a) / 2,
		half = div(mid - a, size) + 2;
	return {
		origin: mid - half * size,
		extent: half * 2
	};
}

function offset(point, o) {
	return [
		point[0] - o[0],
		point[1] - o[1]
	];
}

function grid(box, size) {
	var self = {}, cells = [];

	function get(cell) {
		return cells[cell[0]][cell[1]]; 
	}

	function set(cell, value) {
		cells[cell[0]][cell[1]] = value;	
	}

	function markCellForPoint(point) {
		var cell = offset(point, self.origin).map(function(i) {
			return div(i, size);
		});
		set(cell, 1);
		return cell;
	}

	function markCells(polyline) {
		polyline.forEach(function(point) {
			var cell = markCellForPoint(point);
			markNeighbors(cell);
		});
	}

	function markNeighbors(cell) {
		if (!get(cell)) {
			return;
		}
		[[- 1, - 1], [-1, 0], [-1, 1], [0, -1], [0, 1], [1, 1], [1, 0], [1, 1]].forEach(function(delta) {
			var x = cell[0] + delta[0], y = cell[1] + delta[1];
			if (x < 0 || x > self.extent[0]) {
				return;
			}
			if (y < 0 || y > self.extent[1]) {
				return;
			}
			set([x, y], 1);
		});
	}

	function forEach(fn) {
		var x, y;
		for (x = 0; x < self.extent[0]; x += 1) {
			for (y = 0; y < self.extent[1]; y += 1) {
				fn([x, y]);
			}
		}
	}

	function addNeighbors() {
		forEach(markNeighbors);
	}

	function createCells() {
		var x, y, row;
		cells = [];
		for(x = 0; x < self.extent[0]; x++) {
			row = cells[x] = [];
			for(y = 0; y < self.extent[1]; y++) {
				row[y] = 0;
			} 
		}
	}

	function addFat(polyline) {
		markCells(polyline);
	}

	function init() {
		var x, y;

		x = computeExtent(box[0][0], box[1][0], size);
		y = computeExtent(box[0][1], box[1][1], size);

		self.origin = [x.origin, y.origin];
		self.extent = [x.extent, y.extent];

		createCells();
		return self;
	}

	self.addFat = addFat;

	return init();
}