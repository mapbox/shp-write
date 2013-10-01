var ext = require('./extent');

module.exports = function writePoly(geometries, extent, fileLength, TYPE) {

    var headerLength = 48,
        totalLength =
            // header
            16 +
            // feature headers
            (geometries.length * headerLength) +
            // points
            (totalPoints(geometries) * 16),
        shpBuffer = new ArrayBuffer(totalLength),
        shpView = new DataView(shpBuffer),
        shxBuffer = new ArrayBuffer(geometries.length * 8),
        shxView = new DataView(shxBuffer),
        shpI = 0, shxI = 0;

    geometries.forEach(writePolyLine);

    function writePolyLine(coordinates, i) {

        var featureExtent = ext.blank(),
            contentLength = (coordinates.length * 16) + 48;


        coordinates.forEach(function(c) {
            ext.enlarge(featureExtent, c);
            ext.enlarge(extent, c);
        });

        // index
        // offset
        shxView.setInt32(shxI, fileLength / 2); // length in 16-bit words
        // offset length
        shxView.setInt32(shxI + 4, contentLength / 2);

        // HEADER
        // 4 record number
        // 4 content length in 16-bit words (20/2)
        shpView.setInt32(shpI, i);
        shpView.setInt32(shpI + 4, contentLength / 2);


        shpI += 8;

        shpView.setInt32(shpI, TYPE, true); // POLYLINE=3

        // EXTENT
        shpView.setFloat64(shpI + 4, featureExtent.xmin, true);
        shpView.setFloat64(shpI + 12, featureExtent.ymin, true);
        shpView.setFloat64(shpI + 20, featureExtent.xmax, true);
        shpView.setFloat64(shpI + 28, featureExtent.ymax, true);

        // PARTS=1
        shpView.setInt32(shpI + 36, 1, true);
        // POINTS
        shpView.setInt32(shpI + 40, coordinates.length, true);
        // The only part - index zero
        shpView.setInt32(shpI + 44, 0, true);

        shpI += 48;

        coordinates.forEach(function writeLine(coords, i) {
            shpView.setFloat64(shpI, coords[0], true); // X
            shpView.setFloat64(shpI + 8, coords[1], true); // Y
            shpI += 16;
        });

        shxI += 8;

        fileLength += contentLength;
    }


    function totalPoints(geometries) {
        var sum = 0;
        geometries.forEach(function(g) { sum += g.length; });
        return sum;
    }

    return {
        fileLength: fileLength,
        shp: shpView,
        shx: shxView
    };
};
