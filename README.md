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

- Requires a capable fancy modern browser with [Typed Arrays](http://caniuse.com/#feat=typedarrays)
  support
- Geometries: Point, LineString, Polygon, MultiLineString, MultiPolygon
- Tabular-style properties export with Shapefile's field name length limit
- Uses jsZip for ZIP files, but [compression is buggy](https://github.com/Stuk/jszip/issues/53) so it uses STORE instead of DEFLATE.

## Minimal Example

```js
var shpwrite = require("shp-write");

// a GeoJSON bridge for features
const zipData = shpwrite.zip(
  {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [0, 0],
        },
        properties: {
          name: "Foo",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [0, 10],
        },
        properties: {
          name: "Bar",
        },
      },
    ],
  }
);

```

## Options Example

```js
var shpwrite = require("shp-write");

const options = {
  folder: "my_internal_shapes_folder",
  filename: "my_zip_filename",
  outputType: "blob",
  compression: "DEFLATE",
  types: {
    point: "mypoints",
    polygon: "mypolygons",
    line: "mylines",
  },
};

// a GeoJSON bridge for features
const zipData = shpwrite.zip(
  {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [0, 0],
        },
        properties: {
          name: "Foo",
        },
      },
      {
        type: "Feature",
        geometry: {
          type: "Point",
          coordinates: [0, 10],
        },
        properties: {
          name: "Bar",
        },
      },
    ],
  },
  options
);
```

## API
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

### `zip(geojson, [options])`

Generate a ArrayBuffer of a zipped shapefile, dbf, and prj, from a GeoJSON
object.

### DEPRECTEAD! May be removed in a future version
### `download(geojson, [options])`

Given a [GeoJSON](http://geojson.org/) FeatureCollection as an object,
converts convertible features into Shapefiles and triggers a download. 

The additional `options` parameter is passed to the underlying `zip` call. 

This is now marked as deprecated because it applies to browsers only and the
user should instead rely on an external library for this functionality like
`file-saver` or `downloadjs`

## Other Implementations

- https://code.google.com/p/pyshp/

## Reference

- http://www.esri.com/library/whitepapers/pdfs/shapefile.pdf

## Contributors

- Nick Baugh <niftylettuce@gmail.com>
