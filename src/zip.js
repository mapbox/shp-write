var write = require('./write'),
    geojson = require('./geojson'),
    prj = require('./prj'),
    JSZip = require('jszip');

module.exports = function(gj, options) {

    var zip = new JSZip();

    [geojson.point(gj), geojson.line(gj), geojson.polygon(gj)]
        .forEach(function(l) {
        if (l.geometries.length && l.geometries[0].length) {
            write(
                // field definitions
                l.properties,
                // geometry type
                l.type,
                // geometries
                l.geometries,
                function(err, files) {
                    var fileName = options && options.types[l.type.toLowerCase()] ? options.types[l.type.toLowerCase()] : l.type;
                    zip.file(fileName + '.shp', files.shp.buffer, { binary: true });
                    zip.file(fileName + '.shx', files.shx.buffer, { binary: true });
                    zip.file(fileName + '.dbf', files.dbf.buffer, { binary: true });
                    zip.file(fileName + '.prj', prj);
                });
        }
    });

    var generateOptions = { compression:'STORE' };

    if (!process.browser) {
      generateOptions.type = 'nodebuffer';
    }

    return zip.generate(generateOptions);
};
