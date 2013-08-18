var should = require('should');
var grid = require('../lib/grid');

/*global describe, it */

describe('grid', function() {

	it('should create grids based on box size', function() {
		var g;

		g = grid([[0, 0], [2, 6.4]], 3);
		g.should.have.property('origin').eql([-5, -5.8]);
		g.should.have.property('extent').eql([4, 6]);

		g = grid([[-1, 0], [2, 30]], 3);
		g.origin.should.eql([-4.5, -6]);
		g.extent.should.eql([4, 14]);
	});

});