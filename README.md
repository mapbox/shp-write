[![Build Status](https://secure.travis-ci.org/mapbox/shp-write.svg?branch=master)](http://travis-ci.org/mapbox/shp-write)

# shp-write

Writes shapefile in pure javascript. Uses [dbf](https://github.com/tmcw/dbf)
for the data component, and [jsZIP](http://stuk.github.io/jszip/) to generate
ZIP file downloads in-browser.

## Usage

For node.js or [browserify](https://github.com/substack/node-browserify)

    npm install --save shp-write

Or in a browser

    https://unpkg.com/shp-write@latest/shpwrite.js

## Caveats

* Requires a capable fancy modern browser with [Typed Arrays](http://caniuse.com/#feat=typedarrays)
  support
* Geometries: Point, LineString, Polygon, MultiLineString, MultiPolygon
* Tabular-style properties export with Shapefile's field name length limit
* Uses jsZip for ZIP files, but [compression is buggy](https://github.com/Stuk/jszip/issues/53) so it uses STORE instead of DEFLATE.

## Polygon example

![Screenshot](https://github.com/jmmluna/shp-writer/blob/master/download.png)
```js
var shpwrite = require('shp-write');

var options = {
        folder: "my-shapefile",
        types: {
            point: "points",
            polygon: "polygons",
            line: "lines"
        }
    }

// Projection: WGS84

var geojson = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {
       
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -5.467621768044272,
              36.64743275993502
            ],
            [
              -5.467616023377893,
              36.64725262371037
            ],
            [
              -5.467727794596266,
              36.647250311416094
            ],
            [
              -5.4677335449678175,
              36.64743044300626
            ],
            [
              -5.467621768044272,
              36.64743275993502
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {
       
      },
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -5.468579574838962,
              36.64614919750399
            ],
            [
              -5.468677755266358,
              36.64598024036407
            ],
            [
              -5.468701623050998,
              36.64580090235523
            ],
            [
              -5.468830896750093,
              36.64567899650186
            ],
            [
              -5.468975712398754,
              36.64558061087395
            ],
            [
              -5.469122814442818,
              36.64555371740699
            ],
            [
              -5.469162767231621,
              36.645614168657936
            ],
            [
              -5.46917602392241,
              36.645613117730576
            ],
            [
              -5.4691850012488645,
              36.6456478100721
            ],
            [
              -5.46924794829598,
              36.645765734116225
            ],
            [
              -5.4692817042946,
              36.645896186275486
            ],
            [
              -5.469010322149157,
              36.646106416589326
            ],
            [
              -5.468930830984821,
              36.64609508166739
            ],
            [
              -5.468903730321685,
              36.646106711088834
            ],
            [
              -5.468579574838962,
              36.64614919750399
            ]
          ]
        ]
      }
    }
  ]
};

shpwrite.download(geojson, options);

```
## Point example

```js
var shpwrite = require('shp-write');

// (optional) set names for feature types and zipped folder
var options = {
    folder: 'myshapes',
    types: {
        point: 'mypoints',
        polygon: 'mypolygons',
        line: 'mylines'
    }
}
// a GeoJSON bridge for features
shpwrite.download({
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
}, options);
// triggers a download of a zip file with shapefiles contained within.
```

## API

### `download(geojson)`

Given a [GeoJSON](http://geojson.org/) FeatureCollection as an object,
converts convertible features into Shapefiles and triggers a download.

### `write(data, geometrytype, geometries, callback)`

Given data, an array of objects for each row of data, geometry, the OGC standard
geometry type (like `POINT`), geometries, a list of geometries as bare coordinate
arrays, generate a shapfile and call the callback with `err` and an object with

```js
{
    shp: DataView(),
    shx: DataView(),
    dbf: DataView()
}
```

### `zip(geojson)`

Generate a ArrayBuffer of a zipped shapefile, dbf, and prj, from a GeoJSON
object.

## Other Implementations

* https://code.google.com/p/pyshp/

## Reference

* http://www.esri.com/library/whitepapers/pdfs/shapefile.pdf

## Contributors

* Nick Baugh <niftylettuce@gmail.com>
