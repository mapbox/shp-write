var ext = require('./extent');
var types = require('./types');

module.exports.write = function writePoints(coordinates, extent, shpView, shxView, TYPE) {

    var shpI = 0,
        shxI = 0;
        shxOffset = 100,
        is3D = TYPE === types.geometries.MULTIPOINTZ;

    coordinates.forEach(writeMultipoint);

    function writeMultipoint(coords, i) {
        // Length of multipoint record
        var contentLength = 40 + (coords.length * 16);
        if (is3D) {
            contentLength += 32 + (coords.length * 16);
        }
        var totalLength = contentLength + 8;

        var featureExtent = coords.reduce(function(extent, c) {
            return ext.enlarge(extent, c);
        }, ext.blank());

        // Write entry to index file.
        shxView.setInt32(shxI, shxOffset / 2); // Offset in shx file.
        shxView.setInt32(shxI + 4, totalLength / 2); // Record length.
        shxI += 8;
        shxOffset += totalLength;

        // Write record to shape file.
        shpView.setInt32(shpI, i); // Record number
        shpView.setInt32(shpI + 4, contentLength / 2); // Record length (in 16 bit words);
        shpView.setInt32(shpI + 8, TYPE, true); // Record type. MULTIPOINT=8,MULTIPOINTZ=18
        shpView.setFloat64(shpI + 12, featureExtent.xmin, true); // Bounding box.
        shpView.setFloat64(shpI + 20, featureExtent.ymin, true);
        shpView.setFloat64(shpI + 28, featureExtent.xmax, true);
        shpView.setFloat64(shpI + 36, featureExtent.ymax, true);
        shpView.setInt32(shpI + 44, coords.length, true); // Number of points.
        shpI += 48;

        // Write points.
        var zMin = Number.MAX_VALUE;
        var zMax = -Number.MAX_VALUE;
        var mMin = Number.MAX_VALUE;
        var mMax = -Number.MAX_VALUE;
        coords.forEach(function(p, i) {
            if ((coords[2] || 0) < zMin) {
                zMin = coords[2] || 0;
            }

            if ((coords[2] || 0) > zMax) {
                zMax = coords[2] || 0;
            }

            if ((coords[3] || 0) < mMin) {
                mMin = coords[3] || 0;
            }

            if ((coords[3] || 0) > mMax) {
                mMax = coords[3] || 0;
            }

            shpView.setFloat64(shpI, p[0], true); // X
            shpView.setFloat64(shpI + 8, p[1], true); // Y
            shpI += 16;
        });

        if (is3D) {
            // Write z value range
            shpView.setFloat64(shpI, zMin, true);
            shpView.setFloat64(shpI + 8, zMax, true);
            shpI += 16

            // Write z values.
            coords.forEach(function(p, i) {
                shpView.setFloat64(shpI, p[2] || 0, true);
                shpI += 8;
            });

            // Write m value range.
            shpView.setFloat64(shpI, mMin, true);
            shpView.setFloat64(shpI + 8, mMax, true);
            shpI += 16;

            // Write m values;
            coords.forEach(function(p, i) {
                shpView.setFloat64(shpI, p[3] || 0, true);
                shpI += 8;
            });
        }
    }
};

module.exports.extent = function(coordinates) {
    var flattented = justCoords(coordinates);
    return flattented.reduce(function(extent, coords) {
        return ext.enlarge(extent, coords);
    }, ext.blank());
};

module.exports.parts = function parts(geometries, TYPE) {
    return geometries.length;
};

module.exports.shxLength = function(coordinates) {
    return coordinates.length * 8;
};

module.exports.shpLength = function(coordinates, TYPE) {
    var flattented = justCoords(coordinates);
    var length = coordinates.length * 48 + flattented.length * 16;
    if (TYPE === types.geometries.MULTIPOINTZ) {
        length += 32 + (flattented.length * 16);
    }

    return length;
};

function justCoords(coords) {
    var points = [];
    return coords.reduce(function(agg, c) {
        return agg.concat(c);
    }, points);
}
