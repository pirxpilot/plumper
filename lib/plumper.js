const outline = require('./outline');
const grid = require('./grid');
const math = require('./math');

module.exports = plumper;

function addFat(p, fat) {
  return [-1, 1].map(d => math.offset(p, [fat, fat], d));
}

function plumper(polyline, fat, optimize = true) {
  if (!polyline?.length) {
    return;
  }
  if (polyline.length === 1) {
    return [addFat(polyline[0], fat)];
  }

  const oae = math.boxToOriginAndExtent(outline(polyline), fat);
  const scale = math.scale(oae.origin, fat);
  const g = grid(oae.extent);
  const boxes = g.fatten(scale.toGridArray(polyline), optimize);
  return boxes.map(box => [
    scale.toReal(box[0]),
    scale.toReal(math.move(box[1], [1, 1]))
  ]);
}
