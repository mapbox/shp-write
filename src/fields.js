module.exports = function(features) {
    var fields = {};
    features.forEach(collect);
    function collect(f) {
        for (var p in f.properties) fields[p] = typeof f.properties[p];
    }
    return fields;
};
