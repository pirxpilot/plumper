var math = require('../lib/math');

/*global describe, it */

describe('math.div', function() {

  it('should perform integral division', function() {
    math.div(5, 2).should.eql(2);
    math.div(10.1, 2).should.eql(5);
    math.div(6, 2.3).should.eql(2);
    math.div(7.4, 1.1).should.eql(6);
  });

});

describe('math.sign', function() {

  it('should return "1" for positive numbers', function() {
    math.sign(5).should.eql(1);
    math.sign(5.3).should.eql(1);
  });

  it('should return "-1" for negative numbers', function() {
    math.sign(-5).should.eql(-1);
    math.sign(-5.3).should.eql(-1);
  });
});

describe('math.same', function() {

  it('should be true if points are equal', function() {
    math.same([1, 5], [1, 5]).should.equal(true);
  });

  it('should be false if points are different', function() {
    math.same([1, 5], [1.1, 5]).should.equal(false);
    math.same([1, 5.1], [1, 5]).should.equal(false);
    math.same([1.2, 5.2], [1, 5]).should.equal(false);
  });
});

describe('math.offset', function() {

  it('should substract if no d set', function() {
    math.offset([1, 5], [2, 3]).should.eql([-1, 2]);
    math.offset([1, 5], [2, 3], -1).should.eql([-1, 2]);
  });

  it('should add if d set to 1', function() {
    math.offset([1, 5], [1.1, 5], 1).should.eql([2.1, 10]);
    math.offset([1, 5], [-1, -3], 1).should.eql([0, 2]);
  });

});

describe('math.move', function() {

  it('should add offset', function() {
    math.move([1, 5], [1.1, 5]).should.eql([2.1, 10]);
  });

  it('should change original point', function() {
    var point = [1, 5];
    math.move(point, [-1, -3]);
    point.should.eql([0, 2]);
  });

});


describe('math.scale', function() {

  it('should convert to real coordinates', function() {
    var scale = math.scale([-3, 7], 2);

    scale.toReal([0, 0]).should.eql([-3, 7]);
    scale.toReal([1, 2]).should.eql([-1, 11]);

    scale.toRealArray([
      [0, 0],
      [1, 2],
      [5, 7]
    ]).should.eql([
      [-3, 7],
      [-1, 11],
      [7, 21]
    ]);
  });

  it('should convert to grid coordinates', function() {
    var scale = math.scale([-3, 7], 2);

    scale.toGrid([-3, 7]).should.eql([0, 0]);
    scale.toGrid([-2.5, 8.4]).should.eql([0, 0]);
    scale.toGrid([7.3, 22.1]).should.eql([5, 7]);

    scale.toGridArray([
      [-3, 7],
      [-2.5, 8.4],
      [7.3, 22.1]
    ]).should.eql([
      [0, 0],
      [0, 0],
      [5, 7]
    ]);
  });
});

describe('math.boxToOriginAndExtent', function() {
  it('should calculate origin and extent', function() {
    var oae;

    oae = math.boxToOriginAndExtent([[0, 0], [2, 6.4]], 3);
    oae.should.have.property('origin').eql([-5, -5.8]);
    oae.should.have.property('extent').eql([4, 6]);

    oae = math.boxToOriginAndExtent([[-1, 0], [2, 30]], 3);
    oae.origin.should.eql([-5.5, -6]);
    oae.extent.should.eql([4, 14]);

    oae = math.boxToOriginAndExtent([[2, 3], [6, 3]], 1);
    oae.origin.should.eql([0, 1]);
    oae.extent.should.eql([8, 4]);
  });
});
