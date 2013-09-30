module.exports = function(gj) {
    var points = gj.features.filter(isType('Point')).map(justCoords);
    return {
        fields: getProps(gj.features),
        rows: gj.features.map(justRows),
        geometries: gj.features.filter(isType('Point')).map(justCoords)
    };
};

function justRows(t) {
    return t.properties;
}

function justCoords(t) {
    return t.geometry.coordinates;
}

function isType(t) {
    return function(f) { return f.geometry.type === t; };
}

var map = {
    string: 'C',
    number: 'N'
};

function getProps(features) {
    var f = features.reduce(function(memo, f) {
        for (var p in f.properties) {
            memo[p] = typeof f.properties[p];
        }
        return memo;
    }, {});

    var fields = [];
    for (var p in f) {
        if (map[f[p]]) {
            fields.push({
                name: p,
                type: map[f[p]]
            });
        }
    }

    return fields;
}
