var should = require('should');
var plumper = require('../lib/plumper');

/*global describe, it */

describe('plumper', function() {

	it('should return nothing for invalid input', function() {
		should.not.exist(plumper());
		should.not.exist(plumper(4));
		should.not.exist(plumper(4, []));
	});

	it('should calculate simple polygon for a single point', function() {
		var polygon = plumper(1, [[0, 0]]);

		should.exist(polygon);
		polygon.should.have.lengthOf(4);
		polygon.should.be.eql([[0, 1], [1, 0], [0, -1], [-1, 0]]);
	});

});