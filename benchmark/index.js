import fs from 'node:fs';
import polyline from 'polyline-encoded';
import plumper from '../lib/plumper.js';

import longPolyline from '../test/fixtures/long.json' with { type: 'json' };
import shortPolyline from '../test/fixtures/short.json' with { type: 'json' };

function readPolyline(filename) {
  const path = [import.meta.dirname, '../test/fixtures', filename].join('/');
  const txt = fs.readFileSync(path, 'utf8');
  return polyline.decode(txt);
}

const usa = readPolyline('usa.txt');

suite('plumper', () => {
  // run each bench for at least 2s
  set('type', 'adaptive');
  set('mintime', 2000);
  // or switch to fixed number of iterations
  // set('iterations', 500);

  bench('short', function () {
    plumper(shortPolyline, 0.25);
  });

  bench('long', function () {
    plumper(longPolyline, 0.25);
  });

  [1000, 5000, 10000, 30000].forEach(len => {
    const polyline = usa.slice(-len);
    bench(`huge ${len}`, () => {
      plumper(polyline, 0.25);
    });
  });

  [1000, 5000, 10000, 30000].forEach(len => {
    const polyline = usa.slice(-len);
    bench(`huge unoptimized ${len}`, () => {
      plumper(polyline, 0.25, false);
    });
  });
});
