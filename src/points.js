var ext = require('./extent');

module.exports = function writePoints(coordinates, extent, fileLength) {

    var contentLength = 28, // 8 header, 20 content
        shpBuffer = new ArrayBuffer(coordinates.length * contentLength),
        shpView = new DataView(shpBuffer),
        shxBuffer = new ArrayBuffer(coordinates.length * 8),
        shxView = new DataView(shxBuffer),
        shpI = 0, shxI = 0;

    coordinates.forEach(function(coords) {
        ext.enlarge(extent, coords);
    });

    coordinates.forEach(writePoint);

    function writePoint(coords, i) {
        // HEADER
        // 4 record number
        // 4 content length in 16-bit words (20/2)
        shpView.setInt32(shpI, i);
        shpView.setInt32(shpI + 4, 10);

        // record
        // (8 + 8) + 4 = 20 content length
        shpView.setInt32(shpI + 8, 1, true); // POINT=1
        shpView.setFloat64(shpI + 12, coords[0], true); // X
        shpView.setFloat64(shpI + 20, coords[1], true); // Y

        // index
        shxView.setInt32(shxI, fileLength / 2); // length in 16-bit words
        shxView.setInt32(shxI + 4, 10);

        shxI += 8;
        shpI += contentLength;
        fileLength += contentLength;
    }

    return {
        fileLength: fileLength,
        shp: shpView,
        shx: shxView
    };
};
