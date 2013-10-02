var ext = require('./extent');

module.exports.write = function writePoints(geometries, extent, shpView, shxView, TYPE) {

    var shpI = 0,
        shxI = 0,
        fileLength = 100;

    geometries.forEach(writePolyLine);

    function writePolyLine(coordinates, i) {

        var flattened = justCoords(coordinates),
            contentLength = (flattened.length * 16) + 48;

        var featureExtent = flattened.reduce(function(extent, c) {
            return ext.enlarge(extent, c);
        }, ext.blank());

        // INDEX
        // offset
        shxView.setInt32(shxI, fileLength / 2); // length in 16-bit words
        // offset length
        shxView.setInt32(shxI + 4, contentLength / 2);

        // HEADER
        // 4 record number
        // 4 content length in 16-bit words (20/2)
        shpView.setInt32(shpI, i + 1);
        shpView.setInt32(shpI + 4, contentLength / 2);
        shpI += 8;

        // POLYLINE=3
        shpView.setInt32(shpI, TYPE, true);
        // EXTENT
        shpView.setFloat64(shpI + 4, featureExtent.xmin, true);
        shpView.setFloat64(shpI + 12, featureExtent.ymin, true);
        shpView.setFloat64(shpI + 20, featureExtent.xmax, true);
        shpView.setFloat64(shpI + 28, featureExtent.ymax, true);

        // PARTS=1
        shpView.setInt32(shpI + 36, 1, true);
        // POINTS
        shpView.setInt32(shpI + 40, flattened.length, true);
        // The only part - index zero
        shpView.setInt32(shpI + 44, 0, true);

        shpI += 48;

        flattened.forEach(function writeLine(coords, i) {
            shpView.setFloat64(shpI, coords[0], true); // X
            shpView.setFloat64(shpI + 8, coords[1], true); // Y
            shpI += 16;
        });

        shxI += 8;
        fileLength += contentLength;
    }
};

module.exports.shpLength = function(geometries) {
    return (geometries.length * 56) +
        // points
        (justCoords(geometries).length * 16);
};

module.exports.shxLength = function(geometries) {
    return geometries.length * 8;
};

module.exports.extent = function(coordinates) {
    return justCoords(coordinates).reduce(function(extent, c) {
        return ext.enlarge(extent, c);
    }, ext.blank());
};

function totalPoints(geometries) {
    var sum = 0;
    geometries.forEach(function(g) { sum += g.length; });
    return sum;
}

function justCoords(coords, l) {
    if (l === undefined) l = [];
    if (typeof coords[0][0] == 'object') {
        return coords.reduce(function(memo, c) {
            return memo.concat(justCoords(c));
        }, l);
    } else {
        return coords;
    }
}
