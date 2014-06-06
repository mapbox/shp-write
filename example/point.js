var write = require('../src/write'),
    fs = require('fs');

var points = [
    [0, 0],
    //[10, 10]
];


write(
    // feature data
    [
    {foo:'bar'}
    //,{no:'ha'}
    ],
    // geometry type
    'POINT',
    // geometries
    points,
    finish);

function finish(err, files) {
    fs.writeFileSync('points.shp', toBuffer(files.shp.buffer));
    fs.writeFileSync('points.shx', toBuffer(files.shx.buffer));
    fs.writeFileSync('points.dbf', toBuffer(files.dbf.buffer));
}

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength),
        view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) { buffer[i] = view[i]; }
    return buffer;
}
