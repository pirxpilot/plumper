module.exports = rect;

// convert origin, extent format into bounding box format
function box() {
  var self = this;

  return [
    self.origin,
    [
      self.origin[0] + self.extent[0] - 1,
      self.origin[1] + self.extent[1] - 1
    ]
  ];
}

function extend(e) {
  var self = this;
  self.extent[0] += e[0];
  self.extent[1] += e[1];
  return self;
}

// reverse  x, y orientation of the rectangle
function flip() {
  var self = this;
  self.origin.reverse();
  self.extent.reverse();
  return self;
}

// merge rectangles if they can be put one on top of another and still form a rectangle
function merge(r, horizontal) {
  var
    self = this,
    p = 0, q = 1; // standard is vertical merge
  if (horizontal) {
    p = 1;
    q = 0;
  }
  if (self.extent[p] !== r.extent[p]) {
    // console.log('different "width/height"');
    return;
  }
  if (self.origin[p] !== r.origin[p]) {
    // console.log('do not start in the same "column/row"');
    return;
  }
  if (self.origin[q] + self.extent[q] !== r.origin[q]) {
    // console.log('candidate rectangle not directly "above/to-the-right"');
    return;
  }
  self.extent[q] += r.extent[q];
  return self;
}

var proto = {
  flip: flip,
  box: box,
  extend: extend,
  merge: merge
};

function rect(origin, extent) {
  var self = Object.create(proto);

  self.origin = origin;
  self.extent = extent || [1, 1];

  return self;
}
