var write = require('./write').write,
    geojson = require('./geojson'),
    prj = require('./prj'),
    JSZip = require('jszip');

module.exports = function(gj) {
    var zip = new JSZip(),
        layers = zip.folder('layers');

    [geojson.point(gj), geojson.line(gj), geojson.polygon(gj)]
        .forEach(function(l) {
        if (l.geometries.length) {
            write(
                // field definitions
                l.properties,
                // geometry type
                l.type,
                // geometries
                l.geometries,
                function(err, files) {
                    layers.file(l.type + '.shp', files.shp.buffer, { binary: true });
                    layers.file(l.type + '.shx', files.shx.buffer, { binary: true });
                    layers.file(l.type + '.dbf', files.dbf.buffer, { binary: true });
                    layers.file(l.type + '.prj', prj);
                });
        }
    });

    var content = zip.generate({compression:'STORE'});
    location.href = 'data:application/zip;base64,' + content;
};
