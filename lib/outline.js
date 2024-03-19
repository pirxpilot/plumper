module.exports = outline;

// finds a smallest possible bounding rectangle for a set of points
function outline(points) {
  var se, nw;
  if (!points || !points.length) {
    return;
  }
  se = [points[0][0], points[0][1]];
  nw = [se[0], se[1]];
  points.forEach(function(point) {
    var x = point[0], y = point[1];
    if (x < se[0]) {
      se[0] = x;
    }
    if (x > nw[0]) {
      nw[0] = x;
    }
    if (y < se[1]) {
      se[1] = y;
    }
    if (y > nw[1]) {
      nw[1] = y;
    }
  });
  return [se, nw];
}
