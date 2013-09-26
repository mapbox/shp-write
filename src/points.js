var ext = require('./extent');

module.exports = function writePoints(coordinates, extent, fileLength) {

    var contentLength = 28, // 8 header, 20 content
        shpBuffer = new ArrayBuffer(coordinates.length * 28),
        shpView = new DataView(shpBuffer),
        shxBuffer = new ArrayBuffer(coordinates.length * 8),
        shxView = new DataView(shxBuffer),
        shpI, shxI;

    coordinates.forEach(writePoint);

    function writePoint(coords, i) {
        ext.enlarge(extent, coords);

        // write point index
        shpView.setInt32(shpI + 0, i);
        shpView.setInt32(shpI += 4, 10); shpI += 4;

        // write point coordinates
        shpView.setInt32(shpI += 8, 1, true);
        shpView.setFloat64(shpI += 12, coords[0], true);
        shpView.setFloat64(shpI += 20, coords[1], true); shpI += 8;

        shxView.setInt32(shxI + 0, fileLength / 2);
        shxView.setInt32(shxI += 4, 10); shxI += 4;

        fileLength += contentLength;
    }

    return {
        fileLength: fileLength,
        shp: shpView,
        shx: shxView
    };
};
