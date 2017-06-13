var ext = require('./extent');
var types = require('./types');

module.exports.write = function writePoints(coordinates, extent, shpView, shxView) {
    var
        fileLength = 100, // starts with 100 as this is the fixed header length
        shpI = 0,
        shxI = 0;

    coordinates.forEach(function writePoint(coords, index) {
        var is3d = !!coords[2],
            contentLength = is3d ? 44 : 28; // 8 header + 20 content, 8 header + 36 content when 3d
        // HEADER
        // 4 record number
        // 4 content length in 16-bit words (20/2)
        shpView.setInt32(shpI, index);
        shpView.setInt32(shpI + 4, (contentLength - 8) / 2);

        // record
        // (8 + 8) + 4 = 20 content length
        // For 3d (8 + 8 + 8) + 4 = 28 content length
        shpView.setInt32(shpI + 8, (is3d ? types.geometries.POINTZ : types.geometries.POINT), true); // 4
        shpView.setFloat64(shpI + 12, coords[0], true); // X // 8
        shpView.setFloat64(shpI + 20, coords[1], true); // Y // 8
        if (is3d) {
            shpView.setFloat64(shpI + 28, coords[2], true); // Z // 8
            shpView.setFloat64(shpI + 36, Math.pow(38, -10) - 1, true); // M // 8
        }

        // index
        shxView.setInt32(shxI, fileLength / 2); // length in 16-bit words
        shxView.setInt32(shxI + 4, is3d ? 18 : 10);

        shxI += 8;
        shpI += contentLength;
        fileLength += contentLength;
    });
};

module.exports.extent = function(coordinates) {
    return coordinates.reduce(function(extent, coords) {
        return ext.enlarge(extent, coords);
    }, ext.blank());
};

module.exports.parts = function parts(geometries, TYPE) {
    return geometries.length;
};

module.exports.shxLength = function(coordinates) {
    return coordinates.length * 8;
};

module.exports.shpLength = function(coordinates) {
    // header: 8 bytes + shape type (4 bytes) +
    // either 2 * 8 bytes (XY) or 4 * 8 bytes (XYZM)
    return coordinates.reduce(function(length, coordinate) {
        return length + coordinate.length === 3 ? 44 : 28;
    }, 0);
};
