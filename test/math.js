const math = require('../lib/math');

const { describe, it } = require('node:test');

describe('math.div', () => {
  it('should perform integral division', t => {
    t.assert.equal(math.div(5, 2), 2);
    t.assert.equal(math.div(10.1, 2), 5);
    t.assert.equal(math.div(6, 2.3), 2);
    t.assert.equal(math.div(7.4, 1.1), 6);
  });
});

describe('math.sign', () => {
  it('should return "1" for positive numbers', t => {
    t.assert.equal(math.sign(5), 1);
    t.assert.equal(math.sign(5.3), 1);
  });

  it('should return "-1" for negative numbers', t => {
    t.assert.equal(math.sign(-5), -1);
    t.assert.equal(math.sign(-5.3), -1);
  });
});

describe('math.same', () => {
  it('should be true if points are equal', t => {
    t.assert.equal(math.same([1, 5], [1, 5]), true);
  });

  it('should be false if points are different', t => {
    t.assert.equal(math.same([1, 5], [1.1, 5]), false);
    t.assert.equal(math.same([1, 5.1], [1, 5]), false);
    t.assert.equal(math.same([1.2, 5.2], [1, 5]), false);
  });
});

describe('math.offset', () => {
  it('should substract if no d set', t => {
    t.assert.deepEqual(math.offset([1, 5], [2, 3]), [-1, 2]);
    t.assert.deepEqual(math.offset([1, 5], [2, 3], -1), [-1, 2]);
  });

  it('should add if d set to 1', t => {
    t.assert.deepEqual(math.offset([1, 5], [1.1, 5], 1), [2.1, 10]);
    t.assert.deepEqual(math.offset([1, 5], [-1, -3], 1), [0, 2]);
  });
});

describe('math.move', () => {
  it('should add offset', t => {
    t.assert.deepEqual(math.move([1, 5], [1.1, 5]), [2.1, 10]);
  });

  it('should change original point', t => {
    const point = [1, 5];
    math.move(point, [-1, -3]);
    t.assert.deepEqual(point, [0, 2]);
  });
});

describe('math.scale', () => {
  it('should convert to real coordinates', t => {
    const scale = math.scale([-3, 7], 2);

    t.assert.deepEqual(scale.toReal([0, 0]), [-3, 7]);
    t.assert.deepEqual(scale.toReal([1, 2]), [-1, 11]);

    t.assert.deepEqual(
      scale.toRealArray([
        [0, 0],
        [1, 2],
        [5, 7]
      ]),
      [
        [-3, 7],
        [-1, 11],
        [7, 21]
      ]
    );
  });

  it('should convert to grid coordinates', t => {
    const scale = math.scale([-3, 7], 2);

    t.assert.deepEqual(scale.toGrid([-3, 7]), [0, 0]);
    t.assert.deepEqual(scale.toGrid([-2.5, 8.4]), [0, 0]);
    t.assert.deepEqual(scale.toGrid([7.3, 22.1]), [5, 7]);

    t.assert.deepEqual(
      scale.toGridArray([
        [-3, 7],
        [-2.5, 8.4],
        [7.3, 22.1]
      ]),
      [
        [0, 0],
        [0, 0],
        [5, 7]
      ]
    );
  });
});

describe('math.boxToOriginAndExtent', () => {
  it('should calculate origin and extent', t => {
    let oae = math.boxToOriginAndExtent(
      [
        [0, 0],
        [2, 6.4]
      ],
      3
    );
    t.assert.deepEqual(oae.origin, [-5, -5.8]);
    t.assert.deepEqual(oae.extent, [4, 6]);

    oae = math.boxToOriginAndExtent(
      [
        [-1, 0],
        [2, 30]
      ],
      3
    );
    t.assert.deepEqual(oae.origin, [-5.5, -6]);
    t.assert.deepEqual(oae.extent, [4, 14]);

    oae = math.boxToOriginAndExtent(
      [
        [2, 3],
        [6, 3]
      ],
      1
    );
    t.assert.deepEqual(oae.origin, [0, 1]);
    t.assert.deepEqual(oae.extent, [8, 4]);
  });
});
