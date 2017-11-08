var write = require('../src/write'),
    fs = require('fs');

var points = [[
    [0, 0],
    [10, 0],
    [10, 10],
    [0, 10]
]];

write(
    // feature data
    [{ id: 0 }],
    // geometry type
    'MULTIPOINT',
    // geometries
    points,
    finish);

function finish(err, files) {
    fs.writeFileSync('multipoint.shp', toBuffer(files.shp.buffer));
    fs.writeFileSync('multipoint.shx', toBuffer(files.shx.buffer));
    fs.writeFileSync('multipoint.dbf', toBuffer(files.dbf.buffer));
}

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength),
        view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) { buffer[i] = view[i]; }
    return buffer;
}
