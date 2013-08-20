var math = require('./math');

module.exports = rect;

function rect(origin, extent) {
  var self = {
    origin: origin,
    extent: extent || [1, 1]
  };

  // convert origin, extent format into bounding box format
  function box() {
    var ex = math.offset(self.extent, [1, 1]);
    return [self.origin, math.offset(self.origin, ex, 1)];
  }

  function extend(e) {
    self.extent = math.offset(self.extent, e, 1);
    return self;
  }

  // reverse  x, y orientation of the rectangle
  function flip() {
    self.origin.reverse();
    self.extent.reverse();
    return self;
  }

  // merge rectangles if they can be put one on top of another and still form a rectangle
  function merge(r, horizontal) {
    var p = 0, q = 1; // standard is vertical merge
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

  self.flip = flip;
  self.box = box;
  self.extend = extend;
  self.merge = merge;

  return self;
}