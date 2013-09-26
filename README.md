# shp-write

writes shapefiles in pure javascript. uses [dbf](https://github.com/tmcw/dbf)
for the data.

## example

```js
var write = require('shp-write').write;

write(
    // field definitions
    [{ type: 'C', name: 'foo' }],
    // feature data
    [{ foo: 'bar' }],
    // geometry type
    'POINT',
    // geometries
    [[0, 0]],
    done);

function done(err, files) {

}
```

## Other Implementations

* https://code.google.com/p/pyshp/

## Reference

* http://www.esri.com/library/whitepapers/pdfs/shapefile.pdf
