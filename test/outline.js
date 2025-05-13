const should = require('should');
const outline = require('../lib/outline');

const { describe, it } = require('node:test');

describe('outline', () => {
  it('should return nothing for empty input', () => {
    should.not.exist(outline());
    should.not.exist(outline([]));
  });

  it('should outline a single point', () => {
    const o = outline([[0, 0]]);

    should.exist(o);
    o.should.have.lengthOf(2);
    o.should.be.eql([
      [0, 0],
      [0, 0]
    ]);
    o[0].should.not.be.equal(o[1]);
  });

  it('should outline a polygon', () => {
    const o = outline([
      [0, 0],
      [3, 4],
      [-2, 6],
      [0, 7]
    ]);

    should.exist(o);
    o.should.have.lengthOf(2);
    o.should.be.eql([
      [-2, 0],
      [3, 7]
    ]);
  });
});
