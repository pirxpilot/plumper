# plumper

Converts a polyline to a polygon outline


## API

```javascript
// polyline is a set of points
var polyline = [[0,2], [3,4], [7,8]];
// fat is a factor corresponding to the width of the polyline
var fat = 5;
// polygon is an array of points outlining a polygon that completely encompasses a line
var polygon = plumper(fat, polyline);
```
