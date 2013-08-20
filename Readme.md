[![Build Status](https://secure.travis-ci.org/code42day/plumper.png)](http://travis-ci.org/code42day/plumper)
[![NPM version](https://badge.fury.io/js/plumper.png)](http://badge.fury.io/js/plumper)

# plumper

Makes your polyline look fat using routeboxer algorithm


## API

```javascript
// polyline is a set of points
var polyline = [[0,2], [3,4], [7,8]];
// fat is a factor corresponding to the width of the polyline
var fat = 5;
// polygon is an array of points outlining a polygon that completely encompasses a line
var polygon = plumper(polyline, fat);
```
