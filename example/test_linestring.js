var write = require('../src/write'),
    fs = require('fs');

var points = [[
    [0, 0],
    [10, 0],
    [15, 5],
    [20, -5]
]];

write(
    // feature data
    [{ id: 0 }],
    // geometry type
    'POLYLINE',
    // geometries
    points,
    finish);

function finish(err, files) {
    fs.writeFileSync('lines.shp', toBuffer(files.shp.buffer));
    fs.writeFileSync('lines.shx', toBuffer(files.shx.buffer));
    fs.writeFileSync('lines.dbf', toBuffer(files.dbf.buffer));
}

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength),
        view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) { buffer[i] = view[i]; }
    return buffer;
}
