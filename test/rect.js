const rect = require('../lib/rect');

const { describe, it } = require('node:test');

describe('rect', () => {
  it('box should return bounding box', t => {
    let b = rect([-1, -5]).box();

    t.assert.equal(b.length, 2);
    t.assert.deepEqual(b, [
      [-1, -5],
      [-1, -5]
    ]);

    b = rect([0, 0], [3, 5]).box();

    t.assert.equal(b.length, 2);
    t.assert.deepEqual(b, [
      [0, 0],
      [2, 4]
    ]);

    b = rect([-1, -5], [3, 2]).box();

    t.assert.equal(b.length, 2);
    t.assert.deepEqual(b, [
      [-1, -5],
      [1, -4]
    ]);
  });

  it('flip should reverse coordinates', t => {
    let b = rect([0, 0], [3, 5]).flip().box();

    t.assert.equal(b.length, 2);
    t.assert.deepEqual(b, [
      [0, 0],
      [4, 2]
    ]);

    b = rect([-1, -5], [3, 2]).flip().box();

    t.assert.equal(b.length, 2);
    t.assert.deepEqual(b, [
      [-5, -1],
      [-4, 1]
    ]);
  });

  it('extend should make rectangle bigger', t => {
    const r = rect([1, 5], [3, 4]);
    r.extend([2, 5]);
    t.assert.deepEqual(r.origin, [1, 5]);
    t.assert.deepEqual(r.extent, [5, 9]);
  });

  it('merge should merge rectangles vertically', t => {
    const r = rect([0, 1], [3, 5]);

    t.assert.ok(r.merge(rect([0, 6], [3, 2])));
    t.assert.deepEqual(r.origin, [0, 1]);
    t.assert.deepEqual(r.extent, [3, 7]);
  });

  it('merge should ignore non merge-able rectangles', t => {
    const r = rect([0, 1], [3, 5]);
    const box = r.box();

    t.assert.ok(!r.merge(rect([0, 6], [2, 2])), 'width does not match');
    t.assert.deepEqual(box, r.box());

    t.assert.ok(!r.merge(rect([1, 6], [3, 2])), 'bad origin x');
    t.assert.deepEqual(box, r.box());

    t.assert.ok(!r.merge(rect([0, 7], [3, 2])), 'bad origin y');
    t.assert.deepEqual(box, r.box());
  });

  it('merge should merge rectangles horizontally', t => {
    const r = rect([1, 0], [5, 3]);

    t.assert.ok(r.merge(rect([6, 0], [2, 3]), true));
    t.assert.deepEqual(r.origin, [1, 0]);
    t.assert.deepEqual(r.extent, [7, 3]);
  });

  it('merge should ignore non merge-able rectangles', t => {
    const r = rect([1, 0], [5, 3]);
    const box = r.box();

    t.assert.ok(!r.merge(rect([6, 0], [2, 2], true)), 'width does not match');
    t.assert.deepEqual(box, r.box());

    t.assert.ok(!r.merge(rect([6, 1], [2, 3], true)), 'bad origin x');
    t.assert.deepEqual(box, r.box());

    t.assert.ok(!r.merge(rect([7, 0], [2, 3], true)), 'bad origin y');
    t.assert.deepEqual(box, r.box());
  });
});
