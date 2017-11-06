var write = require('../src/write'),
    fs = require('fs');

var lines = [[[
    [0, 0, 1000],
    [10, 0, 2000],
    [15, 5, 3000],
    [20, -5, 4000]
]]];

write(
    // feature data
    [{ id: 0 }],
    // geometry type
    'POLYLINEZ',
    // geometries
    lines,
    finish);

function finish(err, files) {
    fs.writeFileSync('linesz.shp', toBuffer(files.shp.buffer));
    fs.writeFileSync('linesz.shx', toBuffer(files.shx.buffer));
    fs.writeFileSync('linesz.dbf', toBuffer(files.dbf.buffer));
}

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength),
        view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) { buffer[i] = view[i]; }
    return buffer;
}
