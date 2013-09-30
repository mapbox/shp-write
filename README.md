# shp-write

writes shapefiles in pure javascript. uses [dbf](https://github.com/tmcw/dbf)
for the data.

## usage

For node.js or [browserify](https://github.com/substack/node-browserify)

    npm install --save shp-write

## Caveats

* Requires a capable fancy modern browser with [Typed Arrays](http://caniuse.com/#feat=typedarrays)
  support
* Geometries: Point, LineString, Polygon
* Tabular-style properties export with Shapefile's field name length limit

## example

```js
var downloadShp = require('shp-write').download;

// a GeoJSON bridge for features
downloadShp({
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 0]
            },
            properties: {
                name: 'Foo'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 10]
            },
            properties: {
                name: 'Bar'
            }
        }
    ]
});
```

## Other Implementations

* https://code.google.com/p/pyshp/

## Reference

* http://www.esri.com/library/whitepapers/pdfs/shapefile.pdf
