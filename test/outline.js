const outline = require('../lib/outline');

const { describe, it } = require('node:test');

describe('outline', () => {
  it('should return nothing for empty input', t => {
    t.assert.equal(outline(), undefined);
    t.assert.equal(outline([]), undefined);
  });

  it('should outline a single point', t => {
    const o = outline([[0, 0]]);

    t.assert.ok(o);
    t.assert.equal(o.length, 2);
    t.assert.deepEqual(o, [
      [0, 0],
      [0, 0]
    ]);
    t.assert.notEqual(o[0], o[1]);
  });

  it('should outline a polygon', t => {
    const o = outline([
      [0, 0],
      [3, 4],
      [-2, 6],
      [0, 7]
    ]);

    t.assert.ok(o);
    t.assert.equal(o.length, 2);
    t.assert.deepEqual(o, [
      [-2, 0],
      [3, 7]
    ]);
  });
});
