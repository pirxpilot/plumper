export function div(a, b) {
  return Math.floor(a / b); // we only have positive a and b
}

export function sign(n) {
  return n < 0 ? -1 : 1;
}

export function same(p1, p2) {
  return p1[0] === p2[0] && p1[1] === p2[1];
}

export function offset(point, o, d = -1) {
  return [point[0] + d * o[0], point[1] + d * o[1]];
}

export function move(point, o) {
  point[0] += o[0];
  point[1] += o[1];
  return point;
}

function computeExtent(a, b, size) {
  const mid = (a + b) / 2;
  const half = div(mid - a, size) + 2;
  return {
    origin: mid - half * size,
    extent: half * 2
  };
}

export function boxToOriginAndExtent(box, size) {
  const r = [computeExtent(box[0][0], box[1][0], size), computeExtent(box[0][1], box[1][1], size)];
  return {
    origin: [r[0].origin, r[1].origin],
    extent: [r[0].extent, r[1].extent]
  };
}

export function scale(origin, size) {
  return {
    toGrid,
    toReal,
    toGridArray,
    toRealArray
  };

  function toGrid(point) {
    const p = offset(point, origin, -1);
    p[0] = div(p[0], size);
    p[1] = div(p[1], size);
    return p;
  }

  function toReal(point) {
    const p = [point[0] * size, point[1] * size];
    return move(p, origin);
  }

  function toGridArray(arr) {
    return arr.map(toGrid);
  }

  function toRealArray(arr) {
    return arr.map(toReal);
  }
}
