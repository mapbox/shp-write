var types = require('./types'),
    writePoints = require('./points'),
    writePolygons = require('./poly').writePolygons;

var recordHeaderLength = 8;

module.exports = function write(geometries) {

    if (!geometries.length) return null;
    var TYPE = types.geometries[geometries[0].type.toUpperCase()];
    if (TYPE === undefined) return null;

    var shpHeaderBuf = new ArrayBuffer(100),
        shpHeaderView = new DataView(shpHeaderBuf),
        shxHeaderBuf = new ArrayBuffer(100),
        shxHeaderView = new DataView(shxHeaderBuf),
        extent = {
            xmin: Number.MAX_VALUE,
            ymin: Number.MAX_VALUE,
            xmax: -Number.MAX_VALUE,
            ymax: -Number.MAX_VALUE
        },
        fileLength = 100,
        byteShxLength = 100;

    writeEndian(shpHeaderView);
    writeEndian(shxHeaderView);

    shpHeaderView.setInt32(32, TYPE, true);
    shxHeaderView.setInt32(32, TYPE, true);

    var data;
    if (TYPE === 1) {
        data = writePoints(geometries, extent, fileLength);
        fileLength = data.fileLength;
    }

    writeExtent(extent, shpHeaderView);
    writeExtent(extent, shxHeaderView);

    // overall shp file length in 16 bit words at byte 24 of shp header
    shpHeaderView.setInt32(24, fileLength / 2);

    // overall shx file length in 16 bit words at byte 24 of shx header
    shxHeaderView.setInt32(24, (50 + geometries.length * 4));

    return {
        successful: true,
        shpHeader: shpHeaderBuf,
        shxHeader: shxHeaderBuf
    };
};

function writeEndian(view) {
    view.setInt32(0, 9994);
    view.setInt32(28, 1000, true);
}

function writeExtent(extent, view) {
    view.setFloat64(36, extent.xmin, true);
    view.setFloat64(44, extent.ymin, true);
    view.setFloat64(52, extent.xmax, true);
    view.setFloat64(60, extent.ymax, true);
}
