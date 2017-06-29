var types = require('./types'),
    dbf = require('dbf'),
    prj = require('./prj'),
    ext = require('./extent'),
    getFields = require('./fields'),
    assert = require('assert'),
    pointWriter = require('./points'),
    polyWriter = require('./poly');

var writers = {
    1: pointWriter,      // Point
    3: polyWriter,       // PolyLine
    5: polyWriter,       // Polygon
    11: pointWriter,     // PointZ
    13: polyWriter,      // PolyLineZ
    15: polyWriter       // PolygonZ
};

var recordHeaderLength = 8;

module.exports = write;

// Low-level writing interface
function write(rows, geometry_type, geometries, callback) {

    var TYPE = types.geometries[geometry_type],
        writer = writers[TYPE],
        parts = writer.parts(geometries, TYPE),
        shpLength = 100 + (parts - geometries.length) * 4 + writer.shpLength(geometries),
        shxLength = 100 + writer.shxLength(geometries),
        shpBuffer = new ArrayBuffer(shpLength),
        shpView = new DataView(shpBuffer),
        shxBuffer = new ArrayBuffer(shxLength),
        shxView = new DataView(shxBuffer),
        extent = writer.extent(geometries);

    writeHeader(shpView, TYPE);
    writeHeader(shxView, TYPE);
    writeExtent(extent, shpView);
    writeExtent(extent, shxView);

    writer.write(geometries, extent,
        new DataView(shpBuffer, 100),
        new DataView(shxBuffer, 100),
        TYPE);

    shpView.setInt32(24, shpLength / 2);
    shxView.setInt32(24, (50 + geometries.length * 4));

    var dbfBuf = dbf.structure(rows);

    callback(null, {
        shp: shpView,
        shx: shxView,
        dbf: dbfBuf,
        prj: prj
    });
}

function writeHeader(view, TYPE) {
    view.setInt32(0, 9994);
    view.setInt32(28, 1000, true);
    view.setInt32(32, TYPE, true);
}

function writeExtent(extent, view) {
    view.setFloat64(36, extent.xmin, true);
    view.setFloat64(44, extent.ymin, true);
    view.setFloat64(52, extent.xmax, true);
    view.setFloat64(60, extent.ymax, true);
    view.setFloat64(68, extent.zmin, true);
    view.setFloat64(76, extent.zmax, true);
    view.setFloat64(84, 0.0, true); // Measure not supported, so always set to 0
    view.setFloat64(92, 0.0, true); // Measure not supported, so always set to 0
}
