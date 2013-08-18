var should = require('should');
var plumper = require('../lib/plumper');

/*global describe, it */

describe('plumper', function() {

  it('should return nothing for invalid input', function() {
    should.not.exist(plumper());
    should.not.exist(plumper(4));
    should.not.exist(plumper(4, []));
  });

  it('should calculate a single box for a single point', function() {
    var boxes = plumper([[0, 0]], 1);

    should.exist(boxes);
    boxes.should.have.lengthOf(1);
    boxes[0].should.have.lengthOf(2);
    boxes[0].should.eql([[-1, -1], [1, 1]]);
  });

  it('should calculate a single box for a horizontal line', function() {
     var boxes = plumper([[2, 3], [6, 3]], 1);

     should.exist(boxes);
     boxes.should.have.lengthOf(1);
     boxes[0].should.be.eql([[1, 2], [7, 4]]);
  });
});