var ext = require('./extent');

module.exports.write = function writePoints(geometries, extent, shpView, shxView, TYPE) {

    var shpI = 0,
        shxI = 0,
        shxOffset = 100;

    geometries.forEach(writePolyLine);

    function writePolyLine(coordinates, i) {

        var flattened = justCoords(coordinates),
            contentLength = (flattened.length * 16) + 48;

        var featureExtent = flattened.reduce(function(extent, c) {
            return ext.enlarge(extent, c);
        }, ext.blank());

        // INDEX
        shxView.setInt32(shxI, shxOffset / 2); // offset
        shxView.setInt32(shxI + 4, contentLength / 2); // offset length

        shxI += 8;
        shxOffset += contentLength + 8;

        shpView.setInt32(shpI, i + 1); // record number
        shpView.setInt32(shpI + 4, contentLength / 2); // length
        shpView.setInt32(shpI + 8, TYPE, true); // POLYLINE=3
        shpView.setFloat64(shpI + 12, featureExtent.xmin, true); // EXTENT
        shpView.setFloat64(shpI + 20, featureExtent.ymin, true);
        shpView.setFloat64(shpI + 28, featureExtent.xmax, true);
        shpView.setFloat64(shpI + 36, featureExtent.ymax, true);
        shpView.setInt32(shpI + 44, 1, true); // PARTS=1
        shpView.setInt32(shpI + 48, flattened.length, true); // POINTS
        shpView.setInt32(shpI + 52, 0, true); // The only part - index zero

        flattened.forEach(function writeLine(coords, i) {
            shpView.setFloat64(shpI + 56 + (i * 16), coords[0], true); // X
            shpView.setFloat64(shpI + 56 + (i * 16) + 8, coords[1], true); // Y
        });

        shpI += contentLength + 8;
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
