import grid from './grid.js';
import {
  boxToOriginAndExtent,
  scale as makeScale,
  move,
  offset
} from './math.js';
import outline from './outline.js';

export default function plumper(polyline, fat, optimize = true) {
  if (!polyline?.length) {
    return;
  }
  if (polyline.length === 1) {
    return [addFat(polyline[0], fat)];
  }

  const oae = boxToOriginAndExtent(outline(polyline), fat);
  const scale = makeScale(oae.origin, fat);
  const g = grid(oae.extent);
  const boxes = g.fatten(scale.toGridArray(polyline), optimize);
  return boxes.map(box => [
    scale.toReal(box[0]),
    scale.toReal(move(box[1], [1, 1]))
  ]);
}

function addFat(p, fat) {
  return [-1, 1].map(d => offset(p, [fat, fat], d));
}
