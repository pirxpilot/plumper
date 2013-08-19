var should = require('should');
var grid = require('../lib/grid');

/*global describe, it */

describe('grid', function() {

  it('should plot points', function() {
    var g, line;

    g = grid([7, 7]);
    g.plot([2, 2], [2, 2]);
    line = g.filter();
    line.should.have.length(1);
    line.should.eql([[2, 2]]);
  });

  it('should plot horizontal lines', function() {
    var g, line;

    g = grid([7, 7]);
    g.plot([2, 2], [5, 2]);
    line = g.filter();
    line.should.have.length(4);
    line.should.eql([[2, 2], [3, 2], [4, 2], [5, 2]]);

    g = grid([7, 7]);
    g.plot([5, 2], [2, 2]);
    line = g.filter();
    line.should.have.length(4);
    line.should.eql([[2, 2], [3, 2], [4, 2], [5, 2]]);
  });

  it('should plot vertical lines', function() {
    var g, line;

    g = grid([7, 7]);
    g.plot([2, 2], [2, 5]);
    line = g.filter();
    line.should.have.length(4);
    line.should.eql([[2, 2], [2, 3], [2, 4], [2, 5]]);

    g = grid([7, 7]);
    g.plot([2, 5], [2, 2]);
    line = g.filter();
    line.should.have.length(4);
    line.should.eql([[2, 2], [2, 3], [2, 4], [2, 5]]);
  });

  it('should plot slanted lines', function() {
    var g, line;

    g = grid([10, 6]);
    g.plot([0, 0], [9, 5]);
    line = g.filter();
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

  it('should add neigbors to selected cells', function() {
    var g = grid([5, 5]), selected;

    g.set([3, 3]);
    g.addNeighbors();
    selected = g.filter();
    selected.should.have.length(9);
    selected.should.eql([
      [2, 2], [2, 3], [2, 4],
      [3, 2], [3 ,3], [3, 4],
      [4, 2], [4, 3], [4, 4]
    ]);

    g = grid([5, 5]);
    g.set([0, 0]);
    g.addNeighbors();
    selected = g.filter();

    selected.should.have.length(4);
    selected.should.eql([
      [0, 0],
      [0, 1],
      [1, 0],
      [1, 1]
    ]);

    g = grid([5, 5]);
    g.set([4, 4]);
    g.set([3, 4]);
    g.addNeighbors();
    selected.should.have.length(4);
  });
});