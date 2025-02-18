# @mapbox/shp-write

Writes shapefile in pure javascript. Uses [dbf](https://github.com/tmcw/dbf)
for the data component, and [jsZIP](http://stuk.github.io/jszip/) to generate downloads in-browser.

> [!IMPORTANT]  
> **The package location for this repo has changed!**
>
> tl;dr: `shp-write` -> [`@mapbox/shp-write`](https://www.npmjs.com/package/@mapbox/shp-write)


## Usage

NPM

    npm install --save @mapbox/shp-write
  
Yarn

    yarn add @mapbox/shp-write

Browser

    https://unpkg.com/@mapbox/shp-write@latest/shpwrite.js

## Caveats

- Requires a capable fancy modern browser with [Typed Arrays](http://caniuse.com/#feat=typedarrays)
  support
- Supports geometries: `Point`, `LineString`, `Polygon`, `MultiLineString`, `MultiPolygon`
- Tabular-style properties export with [10 character field name length limit](https://en.wikipedia.org/wiki/Shapefile#:~:text=Maximum%20length%20of%20field%20names%20is%2010%20characters) 
- Uses jsZip for ZIP files, but [compression is buggy](https://github.com/Stuk/jszip/issues/53) so it uses STORE instead of DEFLATE.

## Example

```js
var shpwrite = require("@mapbox/shp-write");

const geoJSON = {
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
  };

// Optional custom options passed to the underlying `zip` call 
const options = {
  folder: "my_internal_shapes_folder",
  filename: "my_zip_filename",
  outputType: "blob",
  compression: "DEFLATE",
  types: {
    point: "mypoints",
    polygon: "mypolygons",
    polyline: "mylines",
  },
};

const zipData = shpwrite.zip(geoJSON,options);
```

## Custom .prj file
To pass a custom [WKT string](http://www.opengeospatial.org/standards/wkt-crs) in the .prj file to define a different projection the prj option can be used:

```js
var options = {
    prj: 'PROJCS["Amersfoort / RD New",GEOGCS["Amersfoort",DATUM["D_Amersfoort",SPHEROID["Bessel_1841",6377397.155,299.1528128]],PRIMEM["Greenwich",0],UNIT["Degree",0.017453292519943295]],PROJECTION["Stereographic_North_Pole"],PARAMETER["standard_parallel_1",52.15616055555555],PARAMETER["central_meridian",5.38763888888889],PARAMETER["scale_factor",0.9999079],PARAMETER["false_easting",155000],PARAMETER["false_northing",463000],UNIT["Meter",1]]'
}
```

## API

### `write(data, geometrytype, geometries, callback)`

Generates a shapefile and calls the callback with err and an object containing shp, shx, and dbf DataViews.

* data: Array of objects for each row of data.
* geometrytype: The OGC standard geometry type (e.g., POINT).
* geometries: List of geometries as bare coordinate arrays.
* callback: Function to handle the generated DataViews.
  
```js
shpwrite.write(data, geometrytype, geometries, (err, result) => {
  // result is equal to
  // {
  //  shp: DataView(),
  //  shx: DataView(),
  //  dbf: DataView()
  // }
  if (err) throw err;
  console.log(result);
});
```

### `zip(geojson, [options])`

Generate a ArrayBuffer of a zipped shapefile, dbf, and prj, from a GeoJSON
object.

### `download(geojson, [options])`

> [!WARNING]  
> This is now marked as deprecated because it applies to browsers only and the
user should instead rely on an external library for this functionality like
`file-saver` or `downloadjs`

Given a [GeoJSON](http://geojson.org/) FeatureCollection as an object, converts convertible features into Shapefiles and triggers a download. `options` is passed to the underlying `zip` call. 

## Other Implementations

- https://code.google.com/p/pyshp/

## Reference

- http://www.esri.com/library/whitepapers/pdfs/shapefile.pdf

## Contributors

- Nick Baugh <niftylettuce@gmail.com>
- Charles Richardson <charlesrichardsonusa@gmail.com>
