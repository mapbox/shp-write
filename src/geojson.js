module.exports.point = justType('Point', 'POINT', false);
module.exports.pointZ = justType('Point', 'POINTZ', true);
module.exports.line = justType('LineString', 'POLYLINE', false);
module.exports.lineZ = justType('LineString', 'POLYLINEZ', true);
module.exports.polygon = justType('Polygon', 'POLYGON', false);
module.exports.polygonZ = justType('Polygon', 'POLYGONZ', true);

function justType(type, TYPE, just3d) {
    return function(gj) {
        var ofType = gj.features.filter(isType(type));
        var ofDimension = ofType.filter(isOfDimension(TYPE, just3d));

        return {
            geometries: (TYPE === 'POLYLINE' || TYPE === 'POLYLINEZ' ||
                         TYPE === 'POLYGON'  || TYPE === 'POLYGONZ') ?
                [ofDimension.map(justCoords)] :
                ofDimension.map(justCoords),
            properties: ofDimension.map(justProps),
            type: TYPE
        };
    };
}

function justCoords(t) {
    if (t.geometry.coordinates[0] !== undefined &&
        t.geometry.coordinates[0][0] !== undefined &&
        t.geometry.coordinates[0][0][0] !== undefined) {
        // Unwraps rings
        return t.geometry.coordinates[0];
    } else {
        return t.geometry.coordinates;
    }
}

function justProps(t) {
    return t.properties;
}

function isType(t) {
    return function(f) { return f.geometry.type === t; };
}

function isOfDimension(TYPE, just3d) {
    return function(f) {
        var coordinates;
        if (TYPE === 'POINT' || TYPE === 'POINTZ') {
            coordinates = f.geometry.coordinates;
        }
        else {
            coordinates = Array.isArray(f.geometry.coordinates[0][0]) ?
                f.geometry.coordinates[0][0] :
                f.geometry.coordinates[0];
        }
        return just3d ? coordinates.length === 3 : coordinates.length === 2;
    }
}
