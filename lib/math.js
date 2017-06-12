function div(a, b) {
  return Math.floor(a / b); // we only have positive a and b
}

function sign(n) {
  return n < 0 ? -1 : 1;
}

function same(p1, p2) {
  return p1[0] === p2[0] && p1[1] === p2[1];
}

function offset(point, o, d) {
  d = d || -1;
  return [
    point[0] + d * o[0],
    point[1] + d * o[1]
  ];
}

function computeExtent(a, b, size) {
  var mid = (a + b) / 2,
    half = div(mid - a, size) + 2;
  return {
    origin: mid - half * size,
    extent: half * 2
  };
}

function boxToOriginAndExtent(box, size) {
  var r = [
    computeExtent(box[0][0], box[1][0], size),
    computeExtent(box[0][1], box[1][1], size)
  ];
  return {
    origin: [r[0].origin, r[1].origin],
    extent: [r[0].extent, r[1].extent]
  };
}

function scale(origin, size) {
  function toGridImpl(point) {
    var p = offset(point, origin, -1);
    return [
      div(p[0], size),
      div(p[1], size)
    ];
  }

  function toRealImpl(point) {
    var p = [
      point[0] * size,
      point[1] * size
    ];
    return offset(p, origin, 1);
  }

  function toGrid(arr) {
    return Array.isArray(arr[0]) ? arr.map(toGridImpl) : toGridImpl(arr);
  }

  function toReal(arr) {
    return Array.isArray(arr[0]) ? arr.map(toRealImpl) : toRealImpl(arr);
  }

  return {
    toGrid: toGrid,
    toReal: toReal
  };
}

module.exports = {
  div: div,
  sign: sign,
  same: same,
  offset: offset,
  boxToOriginAndExtent: boxToOriginAndExtent,
  scale: scale
};
