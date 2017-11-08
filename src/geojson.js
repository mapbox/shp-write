module.exports.point = justType('Point', 'POINT', false);
module.exports.pointZ = justType('Point', 'POINTZ', true);
module.exports.multipoint = justType('MultiPoint', 'MULTIPOINT', false);
module.exports.multipointZ = justType('MultiPoint', 'MULTIPOINTZ', true);
module.exports.line = justType('LineString', 'POLYLINE', false);
module.exports.lineZ = justType('LineString', 'POLYLINEZ', true);
module.exports.polygon = justType('Polygon', 'POLYGON', false);
module.exports.polygonZ = justType('Polygon', 'POLYGONZ', true);

function justType(type, TYPE, just3D) {
    return function(gj) {
        var oftype = gj.features.filter(isType(type));
        var ofDimension = oftype.filter(isOfDimension(TYPE, just3D));

        return {
            geometries: (TYPE === 'POLYGON' || TYPE === 'POLYLINE' || TYPE === 'POLYGONZ' || TYPE === 'POLYLINEZ') ? [ofDimension.map(justCoords)] : ofDimension.map(justCoords),
            properties: ofDimension.map(justProps),
            type: TYPE
        };
    };
}

function justCoords(t) {
    if (t.geometry.coordinates[0] !== undefined &&
        t.geometry.coordinates[0][0] !== undefined &&
        t.geometry.coordinates[0][0][0] !== undefined) {
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
            coordinates = [f.geometry.coordinates];
        }
        else {
            coordinates = Array.isArray(f.geometry.coordinates[0][0]) ?
                f.geometry.coordinates.reduce(function(agg, c) {
                    return agg.concat(c);
                }, []) :
                f.geometry.coordinates;
        }
        return just3d ? coordinates.some(function(c) { return c.length >= 3 }) : coordinates.every(function(c) { return c.length === 2 });
    }
}
