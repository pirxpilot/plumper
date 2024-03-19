var should = require('should');
var rect = require('../lib/rect');

const { describe, it } = require('node:test');

describe('rect', function () {

  it('box should return bounding box', function () {
    var b;

    b = rect([-1, -5]).box();

    b.should.have.length(2);
    b.should.eql([
      [-1, -5],
      [-1, -5]
    ]);

    b = rect([0, 0], [3, 5]).box();

    b.should.have.length(2);
    b.should.eql([
      [0, 0],
      [2, 4]
    ]);

    b = rect([-1, -5], [3, 2]).box();

    b.should.have.length(2);
    b.should.eql([
      [-1, -5],
      [1, -4]
    ]);
  });


  it('flip should reverse coordinates', function () {
    var b = rect([0, 0], [3, 5]).flip().box();

    b.should.have.length(2);
    b.should.eql([
      [0, 0],
      [4, 2]
    ]);

    b = rect([-1, -5], [3, 2]).flip().box();

    b.should.have.length(2);
    b.should.eql([
      [-5, -1],
      [-4, 1]
    ]);
  });

  it('extend should make rectangle bigger', function () {
    var r = rect([1, 5], [3, 4]);
    r.extend([2, 5]);
    r.origin.should.eql([1, 5]);
    r.extent.should.eql([5, 9]);
  });

  it('merge should merge rectangles vertically', function () {
    var r = rect([0, 1], [3, 5]);

    should.exist(r.merge(rect([0, 6], [3, 2])));
    r.origin.should.eql([0, 1]);
    r.extent.should.eql([3, 7]);
  });

  it('merge should ignore non merge-able rectangles', function () {
    var r = rect([0, 1], [3, 5]),
      box = r.box();

    should.not.exist(r.merge(rect([0, 6], [2, 2])), 'width does not match');
    box.should.eql(r.box());

    should.not.exist(r.merge(rect([1, 6], [3, 2])), 'bad origin x');
    box.should.eql(r.box());

    should.not.exist(r.merge(rect([0, 7], [3, 2])), 'bad origin y');
    box.should.eql(r.box());
  });


  it('merge should merge rectangles horizontally', function () {
    var r = rect([1, 0], [5, 3]);

    should.exist(r.merge(rect([6, 0], [2, 3]), true));
    r.origin.should.eql([1, 0]);
    r.extent.should.eql([7, 3]);
  });

  it('merge should ignore non merge-able rectangles', function () {
    var r = rect([1, 0], [5, 3]),
      box = r.box();

    should.not.exist(r.merge(rect([6, 0], [2, 2], true)), 'width does not match');
    box.should.eql(r.box());

    should.not.exist(r.merge(rect([6, 1], [2, 3], true)), 'bad origin x');
    box.should.eql(r.box());

    should.not.exist(r.merge(rect([7, 0], [2, 3], true)), 'bad origin y');
    box.should.eql(r.box());
  });
});
