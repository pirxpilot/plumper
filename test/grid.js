const grid = require('../lib/grid');

const { describe, it } = require('node:test');

describe('grid', () => {
  it('should plot points', () => {
    const g = grid([7, 7]);
    g.plot([2, 2], [2, 2]);
    const line = g.filter();
    line.should.have.length(1);
    line.should.eql([[2, 2]]);
  });

  it('should plot horizontal lines', () => {
    let g = grid([7, 7]);
    g.plot([2, 2], [5, 2]);
    let line = g.filter();
    line.should.have.length(4);
    line.should.eql([
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 2]
    ]);

    g = grid([7, 7]);
    g.plot([5, 2], [2, 2]);
    line = g.filter();
    line.should.have.length(4);
    line.should.eql([
      [2, 2],
      [3, 2],
      [4, 2],
      [5, 2]
    ]);
  });

  it('should plot vertical lines', () => {
    let g = grid([7, 7]);
    g.plot([2, 2], [2, 5]);
    let line = g.filter();
    line.should.have.length(4);
    line.should.eql([
      [2, 2],
      [2, 3],
      [2, 4],
      [2, 5]
    ]);

    g = grid([7, 7]);
    g.plot([2, 5], [2, 2]);
    line = g.filter();
    line.should.have.length(4);
    line.should.eql([
      [2, 2],
      [2, 3],
      [2, 4],
      [2, 5]
    ]);
  });

  it('should plot slanted lines', () => {
    let g = grid([10, 6]);
    g.plot([0, 0], [9, 5]);
    let line = g.filter();
    line.should.have.length(10);
    line.should.eql([
      [0, 0],
      [1, 1],
      [2, 1],
      [3, 2],
      [4, 2],
      [5, 3],
      [6, 3],
      [7, 4],
      [8, 4],
      [9, 5]
    ]);

    g = grid([10, 10]);
    g.plot([5, 9], [0, 0]);
    line = g.filter();
    line.should.have.length(10);
    line.should.eql([
      [0, 0],
      [1, 1],
      [1, 2],
      [2, 3],
      [2, 4],
      [3, 5],
      [3, 6],
      [4, 7],
      [4, 8],
      [5, 9]
    ]);
  });

  it('should add neigbors to selected cells', () => {
    let g = grid([5, 5]);

    g.set([3, 3]);
    g.addNeighbors();
    let selected = g.filter();
    selected.should.have.length(9);
    selected.should.eql([
      [2, 2],
      [3, 2],
      [4, 2],
      [2, 3],
      [3, 3],
      [4, 3],
      [2, 4],
      [3, 4],
      [4, 4]
    ]);

    g = grid([5, 5]);
    g.set([0, 0]);
    g.addNeighbors();
    selected = g.filter();

    selected.should.have.length(4);
    selected.should.eql([
      [0, 0],
      [1, 0],
      [0, 1],
      [1, 1]
    ]);

    g = grid([5, 5]);
    g.set([4, 4]);
    g.set([3, 4]);
    g.addNeighbors();
    selected.should.have.length(4);
  });

  it('forEach enumerates all cells', () => {
    const g = grid([3, 2]);

    function add(c) {
      cells.push(c);
    }

    let cells = [];
    g.forEach(add);
    cells.should.have.length(6);
    cells.should.eql(
      [
        [0, 0],
        [1, 0],
        [2, 0],
        [0, 1],
        [1, 1],
        [2, 1]
      ],
      'row by row'
    );

    // reverse
    cells = [];
    g.forEach(add, true);
    cells.should.have.length(6);
    cells.should.eql(
      [
        [0, 0],
        [0, 1],
        [1, 0],
        [1, 1],
        [2, 0],
        [2, 1]
      ],
      'column by column'
    );
  });

  it('findBoxes should not find any boxes in an empty grid', () => {
    const g = grid([5, 5]);
    let boxes = g.findBoxes();
    boxes.should.have.length(0);
    boxes = g.findBoxes(true);
    boxes.should.have.length(0);
  });

  it('findBoxes should find a single box regardless of the orientation', () => {
    const g = grid([5, 5]);

    for (let x = 2; x < 4; x++) {
      g.set([x, 0]);
      g.set([x, 1]);
    }
    let boxes = g.findBoxes();
    boxes.should.have.length(1);
    boxes[0].box().should.eql([
      [2, 0],
      [3, 1]
    ]);

    boxes = g.findBoxes(true);
    boxes.should.have.length(1);
    boxes[0].box().should.eql([
      [2, 0],
      [3, 1]
    ]);
  });

  it('findBoxes should find different number for row-by-row and column-by-column', () => {
    const g = grid([5, 5]);

    /*
       012234
    4  ------  4
    3  ------  3
    2  ---XX-  2
    1  ---XX-  1
    0  --XX--  0
       0123456
    */

    for (let x = 2; x < 4; x++) {
      g.set([x, 0]);
      g.set([x + 1, 1]);
      g.set([x + 1, 2]);
    }

    let boxes = g.findBoxes();
    boxes.should.have.length(2);
    boxes[0].box().should.eql([
      [2, 0],
      [3, 0]
    ]);
    boxes[1].box().should.eql([
      [3, 1],
      [4, 2]
    ]);

    boxes = g.findBoxes(true);
    boxes.should.have.length(3);
    boxes[0].box().should.eql([
      [2, 0],
      [2, 0]
    ]);
    boxes[1].box().should.eql([
      [3, 0],
      [3, 2]
    ]);
    boxes[2].box().should.eql([
      [4, 1],
      [4, 2]
    ]);
  });

  it('findBoxes should work with small grids', () => {
    const g = grid([3, 3]);

    /*
       012
    2  -XX  2
    1  XXX  1
    0  -XX  0
       012
    */

    g.forEach(cell => {
      if (cell[0] !== 0) {
        g.set(cell);
      }
    });
    g.set([0, 1]);

    let boxes = g.findBoxes();
    boxes.should.have.length(3);
    boxes[0].box().should.eql([
      [1, 0],
      [2, 0]
    ]);
    boxes[1].box().should.eql([
      [0, 1],
      [2, 1]
    ]);
    boxes[2].box().should.eql([
      [1, 2],
      [2, 2]
    ]);

    boxes = g.findBoxes(true);
    boxes.should.have.length(2);
    boxes[0].box().should.eql([
      [0, 1],
      [0, 1]
    ]);
    boxes[1].box().should.eql([
      [1, 0],
      [2, 2]
    ]);
  });
});
