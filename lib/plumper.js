var outline = require('./outline');
var grid = require('./grid');
var math = require('./math');

module.exports = plumper;


function addFat(p, fat) {
	return [-1, 1].map(function(d) {
		return math.offset(p, [fat, fat], d);
	});
}

function plumper(polyline, fat) {
	if (!polyline || !polyline.length) {
		return;
	}
	if (polyline.length == 1) {
		return [addFat(polyline[0], fat)];
	}
	var oae = math.boxToOriginAndExtent(outline(polyline), fat);
	var scale = math.scale(oae.origin, fat);
	var g = grid(oae.extent);
	var boxes = g.fatten(scale.toGrid(polyline));
	return boxes.map(scale.toReal);
}