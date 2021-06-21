module.exports.point = justType('Point', 'POINT');
module.exports.line = justType('LineString', 'POLYLINE');
module.exports.polygon = justType('Polygon', 'POLYGON');
module.exports.multipolygon = justType('MultiPolygon', 'POLYGON');

function justType(type, TYPE) {
    return function(gj) {
        var oftype = gj.features.filter(isType(type));
        return {
            geometries: oftype.map(justCoords),
            properties: oftype.map(justProps),
            type: TYPE
        };
    };
}

function justCoords(t) {
    return t.geometry.coordinates;
}

function justProps(t) {
    return t.properties;
}

function isType(t) {
    if (Array.isArray(t)) return function (f) { return t.includes(f.geometry.type); };
    else return function(f) { return f.geometry.type === t; };
}
