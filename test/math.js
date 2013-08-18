var should = require('should');
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