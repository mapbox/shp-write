var write = require('../src/write'),
    fs = require('fs');

var points = [
    [[-180.0, 10.0], [20.0, 90.0], [180.0, -5.0], [-30.0, -90.0]],
    [[-180.0, 10.0], [20.0, 90.0], [180.0, -5.0], [-30.0, -90.0]]
];

write(
    // feature data
    [{ id: 0 }, { id: 1 }],
    // geometry type
    'POLYGON',
    // geometries
    points,
    finish);

function finish(err, files) {
    fs.writeFileSync('polygon.shp', toBuffer(files.shp.buffer));
    fs.writeFileSync('polygon.shx', toBuffer(files.shx.buffer));
    fs.writeFileSync('polygon.dbf', toBuffer(files.dbf.buffer));
}

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength),
        view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) { buffer[i] = view[i]; }
    return buffer;
}
