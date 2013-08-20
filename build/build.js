
/**
 * Require the given path.
 *
 * @param {String} path
 * @return {Object} exports
 * @api public
 */

function require(path, parent, orig) {
  var resolved = require.resolve(path);

  // lookup failed
  if (null == resolved) {
    orig = orig || path;
    parent = parent || 'root';
    var err = new Error('Failed to require "' + orig + '" from "' + parent + '"');
    err.path = orig;
    err.parent = parent;
    err.require = true;
    throw err;
  }

  var module = require.modules[resolved];

  // perform real require()
  // by invoking the module's
  // registered function
  if (!module.exports) {
    module.exports = {};
    module.client = module.component = true;
    module.call(this, module.exports, require.relative(resolved), module);
  }

  return module.exports;
}

/**
 * Registered modules.
 */

require.modules = {};

/**
 * Registered aliases.
 */

require.aliases = {};

/**
 * Resolve `path`.
 *
 * Lookup:
 *
 *   - PATH/index.js
 *   - PATH.js
 *   - PATH
 *
 * @param {String} path
 * @return {String} path or null
 * @api private
 */

require.resolve = function(path) {
  if (path.charAt(0) === '/') path = path.slice(1);

  var paths = [
    path,
    path + '.js',
    path + '.json',
    path + '/index.js',
    path + '/index.json'
  ];

  for (var i = 0; i < paths.length; i++) {
    var path = paths[i];
    if (require.modules.hasOwnProperty(path)) return path;
    if (require.aliases.hasOwnProperty(path)) return require.aliases[path];
  }
};

/**
 * Normalize `path` relative to the current path.
 *
 * @param {String} curr
 * @param {String} path
 * @return {String}
 * @api private
 */

require.normalize = function(curr, path) {
  var segs = [];

  if ('.' != path.charAt(0)) return path;

  curr = curr.split('/');
  path = path.split('/');

  for (var i = 0; i < path.length; ++i) {
    if ('..' == path[i]) {
      curr.pop();
    } else if ('.' != path[i] && '' != path[i]) {
      segs.push(path[i]);
    }
  }

  return curr.concat(segs).join('/');
};

/**
 * Register module at `path` with callback `definition`.
 *
 * @param {String} path
 * @param {Function} definition
 * @api private
 */

require.register = function(path, definition) {
  require.modules[path] = definition;
};

/**
 * Alias a module definition.
 *
 * @param {String} from
 * @param {String} to
 * @api private
 */

require.alias = function(from, to) {
  if (!require.modules.hasOwnProperty(from)) {
    throw new Error('Failed to alias "' + from + '", it does not exist');
  }
  require.aliases[to] = from;
};

/**
 * Return a require function relative to the `parent` path.
 *
 * @param {String} parent
 * @return {Function}
 * @api private
 */

require.relative = function(parent) {
  var p = require.normalize(parent, '..');

  /**
   * lastIndexOf helper.
   */

  function lastIndexOf(arr, obj) {
    var i = arr.length;
    while (i--) {
      if (arr[i] === obj) return i;
    }
    return -1;
  }

  /**
   * The relative require() itself.
   */

  function localRequire(path) {
    var resolved = localRequire.resolve(path);
    return require(resolved, parent, path);
  }

  /**
   * Resolve relative to the parent.
   */

  localRequire.resolve = function(path) {
    var c = path.charAt(0);
    if ('/' == c) return path.slice(1);
    if ('.' == c) return require.normalize(p, path);

    // resolve deps by returning
    // the dep in the nearest "deps"
    // directory
    var segs = parent.split('/');
    var i = lastIndexOf(segs, 'deps') + 1;
    if (!i) i = 0;
    path = segs.slice(0, i + 1).join('/') + '/deps/' + path;
    return path;
  };

  /**
   * Check if module is defined at `path`.
   */

  localRequire.exists = function(path) {
    return require.modules.hasOwnProperty(localRequire.resolve(path));
  };

  return localRequire;
};
require.register("plumper/index.js", Function("exports, require, module",
"module.exports = require('./lib/plumper');\n//@ sourceURL=plumper/index.js"
));
require.register("plumper/lib/grid.js", Function("exports, require, module",
"var math = require('./math');\nvar rect = require('./rect');\n\nmodule.exports = grid;\n\nfunction grid(extent) {\n  var my = {\n    extent: extent.slice(),\n    cells: []\n  }, self = {};\n\n\n  function get(cell) {\n    return my.cells[cell[0]][cell[1]];\n  }\n\n  function set(cell) {\n    my.cells[cell[0]][cell[1]] = 1;\n  }\n\n  function markCells(polyline) {\n    var i;\n    if (polyline.length === 1) {\n      set(polyline[0]);\n      return;\n    }\n    for (i = 1; i < polyline.length; i++) {\n      plot(polyline[i - 1], polyline[i]);\n    }\n  }\n\n  function valid(cell) {\n    return cell[0] >= 0\n      && cell[1] >= 0\n      && cell[0] < my.extent[0]\n      && cell[1] < my.extent[1];\n  }\n\n  function markNeighbors(cell) {\n    [\n      [-1, -1], [-1, 0], [-1, 1],\n      [ 0, -1],          [ 0, 1],\n      [ 1, -1], [ 1, 0], [ 1, 1]\n    ].forEach(function(d) {\n      var neighbor = math.offset(cell, d);\n      if (valid(neighbor)) {\n        set(neighbor);\n      }\n    });\n  }\n\n  function forEach(fn, flip) {\n    var x, y, columns, rows;\n    if (flip) {\n      columns = my.extent[1];\n      rows = my.extent[0];\n    } else {\n      columns = my.extent[0];\n      rows = my.extent[1];\n    }\n    for (y = 0; y < rows; y += 1) {\n      for (x = 0; x < columns; x += 1) {\n        fn(flip ? [y, x] : [x, y]);\n      }\n    }\n  }\n\n  function forEachValue(fn, flip) {\n    forEach(function(cell) {\n      fn(get(cell), cell);\n    }, flip);\n  }\n\n  function filter(fn) {\n    var result = [];\n    fn = fn || get;\n    forEach(function(cell) {\n      if (fn(cell)) {\n        result.push(cell);\n      }\n    });\n    return result;\n  }\n\n  function createCells() {\n    var x, y, row, cells = [];\n    for(x = 0; x < my.extent[0]; x++) {\n      row = cells[x] = [];\n      for(y = 0; y < my.extent[1]; y++) {\n        row[y] = 0;\n      }\n    }\n    return cells;\n  }\n\n  function addNeighbors() {\n    filter().forEach(function(cell) {\n      markNeighbors(cell);\n    });\n  }\n\n  function lastCell(cell, flip) {\n    var i = flip ? 1 : 0;\n    return cell[i] + 1 === my.extent[i];\n  }\n\n  function findBoxes(flip) {\n    var rectangles = [], current;\n    forEachValue(function(v, cell) {\n      if (v) {\n        if (current) {\n          current.extend(flip ? [0, 1] : [1, 0]);\n        } else {\n          current = rect(cell);\n        }\n      }\n      if (current && (!v || lastCell(cell, flip))) {\n        // try merging into any of the existing rectangles\n        rectangles.forEach(function(r) {\n          if (current && r.merge(current, flip)) {\n            current = null;\n          }\n        });\n        // just add a new one\n        if (current) {\n          rectangles.push(current);\n          current = null;\n        }\n      }\n    }, flip);\n    return rectangles;\n  }\n\n  function calculateBoxes() {\n    var horizontal = findBoxes(false),\n      vertical = findBoxes(true),\n      result;\n\n    result = horizontal.length <= vertical.length ? horizontal : vertical;\n    return result.map(function(r) {\n      return r.box();\n    });\n  }\n\n  // see: Bresenham's line algorithm\n  function plot(start, end) {\n    var d, s, err, e2, point;\n    d = [\n      end[0] - start[0],\n      end[1] - start[1]\n    ];\n    s = d.map(math.sign);\n    d = d.map(Math.abs);\n    point = start.slice();\n    err = d[0] - d[1];\n    while(true) {\n      set(point);\n      if (math.same(point, end)) {\n        return;\n      }\n      e2 = 2 * err;\n      if (e2 > -d[1]) {\n        err -= d[1];\n        point[0] += s[0];\n      }\n      if (math.same(point, end)) {\n        set(point);\n        return;\n      }\n      if (e2 < d[0]) {\n        err += d[0];\n        point[1] += s[1];\n      }\n    }\n  }\n\n  function fatten(polyline) {\n    markCells(polyline);\n    addNeighbors();\n    return calculateBoxes();\n  }\n\n  my.cells = createCells();\n  self.fatten = fatten;\n  self.findBoxes = findBoxes;\n  self.forEach = forEach;\n  self.filter = filter;\n  self.plot = plot;\n  self.addNeighbors = addNeighbors;\n  self.set = set;\n\n  return self;\n}//@ sourceURL=plumper/lib/grid.js"
));
require.register("plumper/lib/math.js", Function("exports, require, module",
"function div(a, b) {\n  return Math.floor(a / b); // we only have positive a and b\n}\n\nfunction sign(n) {\n  return n < 0 ? -1 : 1;\n}\n\nfunction same(p1, p2) {\n  return p1[0] === p2[0] && p1[1] === p2[1];\n}\n\nfunction offset(point, o, d) {\n  d = d || -1;\n  return [\n    point[0] + d * o[0],\n    point[1] + d * o[1]\n  ];\n}\n\nfunction computeExtent(a, b, size) {\n  var mid = (a + b) / 2,\n    half = div(mid - a, size) + 2;\n  return {\n    origin: mid - half * size,\n    extent: half * 2\n  };\n}\n\nfunction boxToOriginAndExtent(box, size) {\n  var r = [\n    computeExtent(box[0][0], box[1][0], size),\n    computeExtent(box[0][1], box[1][1], size)\n  ];\n  return {\n    origin: [r[0].origin, r[1].origin],\n    extent: [r[0].extent, r[1].extent]\n  };\n}\n\nfunction scale(origin, size) {\n  function toGridImpl(point) {\n    return offset(point, origin).map(function(v) {\n      return div(v, size);\n    });\n  }\n\n  function toRealImpl(point) {\n    return offset(point.map(function(v) {\n      return v * size;\n    }), origin, 1);\n  }\n\n  function toGrid(arr) {\n    return Array.isArray(arr[0]) ? arr.map(toGridImpl) : toGridImpl(arr);\n  }\n\n  function toReal(arr) {\n    return Array.isArray(arr[0]) ? arr.map(toRealImpl) : toRealImpl(arr);\n  }\n\n  return {\n    toGrid: toGrid,\n    toReal: toReal\n  };\n}\n\nmodule.exports = {\n  div: div,\n  sign: sign,\n  same: same,\n  offset: offset,\n  boxToOriginAndExtent: boxToOriginAndExtent,\n  scale: scale\n};//@ sourceURL=plumper/lib/math.js"
));
require.register("plumper/lib/outline.js", Function("exports, require, module",
"module.exports = outline;\n\n// finds a smallest possible bounding rectangle for a set of points\nfunction outline(points) {\n  var se, nw;\n  if (!points || !points.length) {\n    return;\n  }\n  se = points[0].slice();\n  nw = points[0].slice();\n  points.forEach(function(point, index) {\n    var x = point[0], y = point[1];\n    if (x < se[0]) {\n      se[0] = x;\n    }\n    if (x > nw[0]) {\n      nw[0] = x;\n    }\n    if (y < se[1]) {\n      se[1] = y;\n    }\n    if (y > nw[1]) {\n      nw[1] = y;\n    }\n  });\n  return [se, nw];\n}//@ sourceURL=plumper/lib/outline.js"
));
require.register("plumper/lib/plumper.js", Function("exports, require, module",
"var outline = require('./outline');\nvar grid = require('./grid');\nvar math = require('./math');\n\nmodule.exports = plumper;\n\n\nfunction addFat(p, fat) {\n  return [-1, 1].map(function(d) {\n    return math.offset(p, [fat, fat], d);\n  });\n}\n\nfunction plumper(polyline, fat) {\n  if (!polyline || !polyline.length) {\n    return;\n  }\n  if (polyline.length == 1) {\n    return [addFat(polyline[0], fat)];\n  }\n  var oae = math.boxToOriginAndExtent(outline(polyline), fat);\n  var scale = math.scale(oae.origin, fat);\n  var g = grid(oae.extent);\n  var boxes = g.fatten(scale.toGrid(polyline));\n  return boxes.map(function(box) {\n    return [ scale.toReal(box[0]), scale.toReal(math.offset(box[1], [-1, -1])) ] ;\n  });\n}//@ sourceURL=plumper/lib/plumper.js"
));
require.register("plumper/lib/rect.js", Function("exports, require, module",
"var math = require('./math');\n\nmodule.exports = rect;\n\nfunction rect(origin, extent) {\n  var self = {\n    origin: origin,\n    extent: extent || [1, 1]\n  };\n\n  // convert origin, extent format into bounding box format\n  function box() {\n    var ex = math.offset(self.extent, [1, 1]);\n    return [self.origin, math.offset(self.origin, ex, 1)];\n  }\n\n  function extend(e) {\n    self.extent = math.offset(self.extent, e, 1);\n    return self;\n  }\n\n  // reverse  x, y orientation of the rectangle\n  function flip() {\n    self.origin.reverse();\n    self.extent.reverse();\n    return self;\n  }\n\n  // merge rectangles if they can be put one on top of another and still form a rectangle\n  function merge(r, horizontal) {\n    var p = 0, q = 1; // standard is vertical merge\n    if (horizontal) {\n      p = 1;\n      q = 0;\n    }\n    if (self.extent[p] !== r.extent[p]) {\n      // console.log('different \"width/height\"');\n      return;\n    }\n    if (self.origin[p] !== r.origin[p]) {\n      // console.log('do not start in the same \"column/row\"');\n      return;\n    }\n    if (self.origin[q] + self.extent[q] !== r.origin[q]) {\n      // console.log('candidate rectangle not directly \"above/to-the-right\"');\n      return;\n    }\n    self.extent[q] += r.extent[q];\n    return self;\n  }\n\n  self.flip = flip;\n  self.box = box;\n  self.extend = extend;\n  self.merge = merge;\n\n  return self;\n}//@ sourceURL=plumper/lib/rect.js"
));
require.alias("plumper/index.js", "plumper/index.js");

