var write = require('../src/write'),
    fs = require('fs');

var polygons = [[[
    [0, 0, 8000],
    [10, 0, 9000],
    [15, 5, 10000],
    [20, -5, 11000],
    [0, 0, 8000]
]]];

write(
    // feature data
    [{ id: 0 }],
    // geometry type
    'POLYGONZ',
    // geometries
    polygons,
    finish);

function finish(err, files) {
    fs.writeFileSync('polygonz.shp', toBuffer(files.shp.buffer));
    fs.writeFileSync('polygonz.shx', toBuffer(files.shx.buffer));
    fs.writeFileSync('polygonz.dbf', toBuffer(files.dbf.buffer));
}

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength),
        view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) { buffer[i] = view[i]; }
    return buffer;
}
