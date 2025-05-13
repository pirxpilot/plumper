const plumper = require('../lib/plumper');

const { describe, it } = require('node:test');

describe('plumper', () => {
  it('should return nothing for invalid input', t => {
    t.assert.equal(plumper(), undefined);
    t.assert.equal(plumper(4), undefined);
    t.assert.equal(plumper(4, []), undefined);
  });

  it('should calculate a single box for a single point', t => {
    const boxes = plumper([[0, 0]], 1);

    t.assert.ok(boxes);
    t.assert.equal(boxes.length, 1);
    t.assert.equal(boxes[0].length, 2);
    t.assert.deepEqual(boxes[0], [
      [-1, -1],
      [1, 1]
    ]);
  });

  it('should calculate a single box for a horizontal line', t => {
    const boxes = plumper(
      [
        [2, 3],
        [6, 3]
      ],
      1
    );

    t.assert.ok(boxes);
    t.assert.equal(boxes.length, 1);
    t.assert.deepEqual(boxes[0], [
      [1, 2],
      [8, 5]
    ]);
  });
});
