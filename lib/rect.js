export default rect;

// convert origin, extent format into bounding box format
function box() {
  return [this.origin, [this.origin[0] + this.extent[0] - 1, this.origin[1] + this.extent[1] - 1]];
}

function extend(e) {
  this.extent[0] += e[0];
  this.extent[1] += e[1];
  return this;
}

// reverse  x, y orientation of the rectangle
function flip() {
  this.origin.reverse();
  this.extent.reverse();
  return this;
}

// merge rectangles if they can be put one on top of another and still form a rectangle
function merge(r, horizontal) {
  let p = 0;
  let q = 1; // standard is vertical merge
  if (horizontal) {
    p = 1;
    q = 0;
  }
  if (this.extent[p] !== r.extent[p]) {
    // console.log('different "width/height"');
    return;
  }
  if (this.origin[p] !== r.origin[p]) {
    // console.log('do not start in the same "column/row"');
    return;
  }
  if (this.origin[q] + this.extent[q] !== r.origin[q]) {
    // console.log('candidate rectangle not directly "above/to-the-right"');
    return;
  }
  this.extent[q] += r.extent[q];
  return this;
}

const proto = {
  flip,
  box,
  extend,
  merge
};

function rect(origin, extent) {
  const self = Object.create(proto);

  self.origin = origin;
  self.extent = extent || [1, 1];

  return self;
}
