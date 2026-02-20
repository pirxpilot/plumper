import { describe, it } from 'node:test';
import { boxToOriginAndExtent, div, move, offset, same, scale, sign } from '../lib/math.js';

describe('div', () => {
  it('should perform integral division', t => {
    t.assert.equal(div(5, 2), 2);
    t.assert.equal(div(10.1, 2), 5);
    t.assert.equal(div(6, 2.3), 2);
    t.assert.equal(div(7.4, 1.1), 6);
  });
});

describe('sign', () => {
  it('should return "1" for positive numbers', t => {
    t.assert.equal(sign(5), 1);
    t.assert.equal(sign(5.3), 1);
  });

  it('should return "-1" for negative numbers', t => {
    t.assert.equal(sign(-5), -1);
    t.assert.equal(sign(-5.3), -1);
  });
});

describe('same', () => {
  it('should be true if points are equal', t => {
    t.assert.equal(same([1, 5], [1, 5]), true);
  });

  it('should be false if points are different', t => {
    t.assert.equal(same([1, 5], [1.1, 5]), false);
    t.assert.equal(same([1, 5.1], [1, 5]), false);
    t.assert.equal(same([1.2, 5.2], [1, 5]), false);
  });
});

describe('offset', () => {
  it('should substract if no d set', t => {
    t.assert.deepEqual(offset([1, 5], [2, 3]), [-1, 2]);
    t.assert.deepEqual(offset([1, 5], [2, 3], -1), [-1, 2]);
  });

  it('should add if d set to 1', t => {
    t.assert.deepEqual(offset([1, 5], [1.1, 5], 1), [2.1, 10]);
    t.assert.deepEqual(offset([1, 5], [-1, -3], 1), [0, 2]);
  });
});

describe('move', () => {
  it('should add offset', t => {
    t.assert.deepEqual(move([1, 5], [1.1, 5]), [2.1, 10]);
  });

  it('should change original point', t => {
    const point = [1, 5];
    move(point, [-1, -3]);
    t.assert.deepEqual(point, [0, 2]);
  });
});

describe('scale', () => {
  it('should convert to real coordinates', t => {
    const s = scale([-3, 7], 2);

    t.assert.deepEqual(s.toReal([0, 0]), [-3, 7]);
    t.assert.deepEqual(s.toReal([1, 2]), [-1, 11]);

    t.assert.deepEqual(
      s.toRealArray([
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
    const s = scale([-3, 7], 2);

    t.assert.deepEqual(s.toGrid([-3, 7]), [0, 0]);
    t.assert.deepEqual(s.toGrid([-2.5, 8.4]), [0, 0]);
    t.assert.deepEqual(s.toGrid([7.3, 22.1]), [5, 7]);

    t.assert.deepEqual(
      s.toGridArray([
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

describe('boxToOriginAndExtent', () => {
  it('should calculate origin and extent', t => {
    let oae = boxToOriginAndExtent(
      [
        [0, 0],
        [2, 6.4]
      ],
      3
    );
    t.assert.deepEqual(oae.origin, [-5, -5.8]);
    t.assert.deepEqual(oae.extent, [4, 6]);

    oae = boxToOriginAndExtent(
      [
        [-1, 0],
        [2, 30]
      ],
      3
    );
    t.assert.deepEqual(oae.origin, [-5.5, -6]);
    t.assert.deepEqual(oae.extent, [4, 14]);

    oae = boxToOriginAndExtent(
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
