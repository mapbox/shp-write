var write = require('./write').write,
    geojson = require('./geojson'),
    JSZip = require('jszip');

module.exports = function(gj) {
    var inferred = geojson(gj);
    write(
        // field definitions
        inferred.fields,
        // feature data
        inferred.rows,
        // geometry type
        'POINT',
        // geometries
        inferred.geometries,
        finish);

    function finish(err, files) {
        var zip = new JSZip(),
            points = zip.folder("points");

        points.file('points.shp', files.shp.buffer, { binary: true });
        points.file('points.shx', files.shx.buffer, { binary: true });
        points.file('points.dbf', files.dbf, { binary: true });

        var content = zip.generate();
        location.href = "data:application/zip;base64," + content;
    }
};
