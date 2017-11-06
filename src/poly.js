var ext = require('./extent'),
    types = require('./types');

module.exports.write = function writePoints(geometries, extent, shpView, shxView, TYPE) {

    var shpI = 0,
        shxI = 0,
        shxOffset = 100,
        is3D = TYPE === types.geometries.POLYLINEZ || TYPE === types.geometries.POLYGONZ;

    geometries.forEach(writePolyLine);

    function writePolyLine(coordinates, i) {

        var flattened = justCoords(coordinates),
            noParts = parts([coordinates], TYPE),
            contentLength = (flattened.length * 16) + 48 + (noParts - 1) * 4;

        if (is3D) {
            contentLength += 32 + flattened.length * 16;
        }

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
        shpView.setInt32(shpI + 8, TYPE, true); // POLYLINE=3, POLYGON=5, POLYLINEZ=13, POLYGONZ=15
        shpView.setFloat64(shpI + 12, featureExtent.xmin, true); // EXTENT
        shpView.setFloat64(shpI + 20, featureExtent.ymin, true);
        shpView.setFloat64(shpI + 28, featureExtent.xmax, true);
        shpView.setFloat64(shpI + 36, featureExtent.ymax, true);
        shpView.setInt32(shpI + 44, noParts, true);
        shpView.setInt32(shpI + 48, flattened.length, true); // POINTS
        shpView.setInt32(shpI + 52, 0, true); // The first part - index zero

        var onlyParts = coordinates.reduce(function (arr, coords) {
            if (Array.isArray(coords[0][0])) {
                arr = arr.concat(coords);
            } else {
                arr.push(coords);
            }
            return arr;
        }, []);
        for (var p = 1; p < noParts; p++) {
            shpView.setInt32( // set part index
                shpI + 52 + (p * 4),
                onlyParts.reduce(function (a, b, idx) {
                    return idx < p ? a + b.length : a;
                }, 0),
                true
            );
        }

        shpI += 56 + (noParts - 1) * 4;

        var zMin = Number.MAX_VALUE;
        var zMax = -Number.MAX_VALUE;
        var mMin = Number.MAX_VALUE;
        var mMax = -Number.MAX_VALUE;
        flattened.forEach(function writeLine(coords, i) {
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

            shpView.setFloat64(shpI, coords[0], true); // X
            shpView.setFloat64(shpI + 8, coords[1], true); // Y

            shpI += 16;
        });

        if (is3D) {
            // Write z value range
            shpView.setFloat64(shpI, zMin, true);
            shpView.setFloat64(shpI + 8, zMax, true);
            shpI += 16

            // Write z values.
            flattened.forEach(function(p, i) {
                shpView.setFloat64(shpI, p[2] || 0, true);
                shpI += 8;
            });

            // Write m value range.
            shpView.setFloat64(shpI, mMin, true);
            shpView.setFloat64(shpI + 8, mMax, true);
            shpI += 16;

            // Write m values;
            flattened.forEach(function(p, i) {
                shpView.setFloat64(shpI, p[3] || 0, true);
                shpI += 8;
            });
        }
    }
};

module.exports.shpLength = function(geometries, TYPE) {
    var flattened = justCoords(geometries);
    var length = (geometries.length * 56) +
        // points
        (flattened.length * 16);
    
    if (TYPE === types.geometries.POLYLINEZ || TYPE === types.geometries.POLYGONZ) {
        length += 32 + flattened.length * 16;
    }

    return length
};

module.exports.shxLength = function(geometries) {
    return geometries.length * 8;
};

module.exports.extent = function(coordinates) {
    return justCoords(coordinates).reduce(function(extent, c) {
        return ext.enlarge(extent, c);
    }, ext.blank());
};

function parts(geometries, TYPE) {
    var no = 1;
    if (TYPE === types.geometries.POLYGON || TYPE === types.geometries.POLYLINE || TYPE === types.geometries.POLYGONZ || TYPE === types.geometries.POLYLINEZ) {
        no = geometries.reduce(function (no, coords) {
            no += coords.length;
            if (Array.isArray(coords[0][0][0])) { // multi
                no += coords.reduce(function (no, rings) {
                    return no + rings.length - 1; // minus outer
                }, 0);
            }
            return no;
        }, 0);
    }
    return no;
}

module.exports.parts = parts;

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

