var write = require('../src/write'),
    fs = require('fs');

var points = [
    [0, 0, 500],
    [10, 0, 400],
    [10, 10, 600],
    [0, 10, 800]
];

write(
    // feature data
    [{ id: 0 }, { id: 1 }, { id: 2 }, { id: 3 }],
    // geometry type
    'POINTZ',
    // geometries
    points,
    finish);

function finish(err, files) {
    fs.writeFileSync('pointz.shp', toBuffer(files.shp.buffer));
    fs.writeFileSync('pointz.shx', toBuffer(files.shx.buffer));
    fs.writeFileSync('pointz.dbf', toBuffer(files.dbf.buffer));
}

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength),
        view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) { buffer[i] = view[i]; }
    return buffer;
}
