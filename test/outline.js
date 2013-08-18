var should = require('should');
var outline = require('../lib/outline');

/*global describe, it */

describe('outline', function() {

	it('should return nothing for empty input', function() {
		should.not.exist(outline());
		should.not.exist(outline([]));
	});

	it('should outline a single point', function() {
		var o = outline([[0, 0]]);

		should.exist(o);
		o.should.have.lengthOf(2);
		o.should.be.eql([[0, 0], [0, 0]]);
		o[0].should.not.be.equal(o[1]);
	});


	it('should outline a polygon', function() {
		var o = outline([[0, 0], [3, 4], [-2, 6], [0, 7]]);

		should.exist(o);
		o.should.have.lengthOf(2);
		o.should.be.eql([[-2, 0], [3, 7]]);
	});
});