module.exports = plumper;

function pointFat(fat, p) {
	var x = p[0], y = p[1];
	return [[x, y + fat], [x + fat, y], [x, y - fat], [x - fat, y]];	
}


function plumper(fat, polyline) {
	if (!polyline || !polyline.length) {
		return;
	}
	if (polyline.length < 2) {
		return pointFat(fat, polyline[0]);
	}
  // implement me!
  console.log('A kuku');
}
