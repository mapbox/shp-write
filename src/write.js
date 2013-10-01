var types = require('./types'),
    dbf = require('dbf'),
    prj = require('./prj'),
    ext = require('./extent'),
    getFields = require('./fields'),
    assert = require('assert'),
    writePoints = require('./points'),
    writePoly = require('./poly');

var recordHeaderLength = 8;

module.exports.write = write;

function write(rows, geometry_type, geometries, callback) {

    var TYPE = types.geometries[geometry_type];
    assert(TYPE, 'unknown geometry type');

    var shpHeader = getHeader(TYPE),
        shxHeader = getHeader(TYPE),
        extent = ext.blank(),
        fileLength = 100,
        byteShxLength = 100;

    var data;

    if (TYPE === 1) {
        data = writePoints(geometries, extent, fileLength);
        fileLength = data.fileLength;
    } else if (TYPE === 3 || TYPE === 5) {
        data = writePoly(geometries, extent, fileLength, TYPE);
        fileLength = data.fileLength;
    }

    writeExtent(extent, shpHeader.view);
    writeExtent(extent, shxHeader.view);

    shpHeader.view.setInt32(24, fileLength / 2);
    shxHeader.view.setInt32(24, (50 + geometries.length * 4));

    var dbfBuf = dbf.structure(rows);
        shp = combine(shpHeader.view, data.shp),
        shx = combine(shxHeader.view, data.shx);

    callback(null, {
        shp: shp,
        shx: shx,
        dbf: dbfBuf,
        prj: prj
    });
}

function combine(a, b) {
    var c = new ArrayBuffer(a.byteLength + b.byteLength),
        d = new DataView(c);
    for (var i = 0; i < a.byteLength; i++) {
        d.setUint8(i, a.getUint8(i));
    }
    for (; i < a.byteLength + b.byteLength; i++) {
        d.setUint8(i, b.getUint8(i - a.byteLength));
    }
    return d;
}

function getHeader(TYPE) {
    var buf = new ArrayBuffer(100), view = new DataView(buf);
    view.setInt32(0, 9994);
    view.setInt32(28, 1000, true);
    view.setInt32(32, TYPE, true);
    return { view: view, buffer: buf };
}

function writeExtent(extent, view) {
    view.setFloat64(36, extent.xmin, true);
    view.setFloat64(44, extent.ymin, true);
    view.setFloat64(52, extent.xmax, true);
    view.setFloat64(60, extent.ymax, true);
}
