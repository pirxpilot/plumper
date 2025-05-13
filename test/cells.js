const cells = require('../lib/cells');

const { describe, it } = require('node:test');

describe('cells', () => {
  it('forEachMarked should enumerate all cells that are set', t => {
    const g = cells(3, 2);
    const results = [];

    function add(x, y) {
      results.push([x, y]);
    }

    g.set(0, 1);
    g.set(1, 0);
    g.set(2, 1);

    g.forEachMarked(add);
    t.assert.deepEqual(
      results,
      [
        [1, 0],
        [0, 1],
        [2, 1]
      ],
      'row by row'
    );
  });

  it('markNeighbors should add neigbors to selected cells', t => {
    const g = cells(5, 5);

    g.markNeighbors(3, 3);

    const results = [];

    function add(x, y) {
      results.push([x, y]);
    }

    g.forEachMarked(add);

    t.assert.equal(results.length, 8);
    t.assert.deepEqual(results, [
      [2, 2],
      [3, 2],
      [4, 2],
      [2, 3],
      [4, 3],
      [2, 4],
      [3, 4],
      [4, 4]
    ]);
  });

  it('valid should detect valid cells', t => {
    const g = cells(2, 8);

    t.assert.ok(!g.valid(2, 8));
    t.assert.ok(!g.valid(0, 8));
    t.assert.ok(!g.valid(2, 0));

    t.assert.ok(g.valid(0, 0));
    t.assert.ok(g.valid(1, 7));
  });
});
