var ext = require('./extent');
var types = require('./types');

module.exports.write = function writePoints(coordinates, extent, shpView, shxView, TYPE) {

    var is3D = TYPE === types.geometries.POINTZ;
    var contentLength = is3D ? 36 : 20, // 20 for non-3D or 36 for 3D
        fileLength = 100,
        shpI = 0,
        shxI = 0;
        
    coordinates.forEach(function writePoint(coords, i) {
        // HEADER
        // 4 record number
        // 4 content length in 16-bit words (20/2)
        shpView.setInt32(shpI, i);
        shpView.setInt32(shpI + 4, contentLength / 2);

        // record
        // (8 + 8) + 4 = 20 content length
        shpView.setInt32(shpI + 8, TYPE, true); // POINT=1, POINTZ=11
        shpView.setFloat64(shpI + 12, coords[0], true); // X
        shpView.setFloat64(shpI + 20, coords[1], true); // Y
        if (is3D) {
            shpView.setFloat64(shpI + 28, coords[2] || 0, true); // Z
            shpView.setFloat64(shpI + 36, coords[3] || 0, true); // M
        }
        
        // index
        shxView.setInt32(shxI, fileLength / 2); // length in 16-bit words
        shxView.setInt32(shxI + 4, contentLength / 2);

        shxI += 8;
        shpI += contentLength + 8;
        fileLength += contentLength + 8;
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

module.exports.shpLength = function(coordinates, TYPE) {
    return coordinates.length * (TYPE === types.geometries.POINTZ ? 44 : 28);
};
