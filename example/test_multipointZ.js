var write = require('../src/write'),
    fs = require('fs');

var points = [[
    [0, 0, 300, 56],
    [10, 0, 400, 34],
    [10, 10, 500, 12],
    [0, 10, 100]
]];

write(
    // feature data
    [{ id: 0 }],
    // geometry type
    'MULTIPOINTZ',
    // geometries
    points,
    finish);

function finish(err, files) {
    fs.writeFileSync('multipointz.shp', toBuffer(files.shp.buffer));
    fs.writeFileSync('multipointz.shx', toBuffer(files.shx.buffer));
    fs.writeFileSync('multipointz.dbf', toBuffer(files.dbf.buffer));
}

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength),
        view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) { buffer[i] = view[i]; }
    return buffer;
}
