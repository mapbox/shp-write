var write = require('./src/write').write,
    fs = require('fs');

write(
    // field definitions
    [{ type: 'C', name: 'foo' }],
    // feature data
    [{ foo: 'bar' }],
    // geometry type
    'POINT',
    // geometries
    [[0, 0]],
    finish);

function finish(err, files) {
    fs.writeFileSync('points.shp', toBuffer(files.shp.buffer));
    fs.writeFileSync('points.shx', toBuffer(files.shx.buffer));
    fs.writeFileSync('points.dbf', files.dbf.buffer);
}

function toBuffer(ab) {
    var buffer = new Buffer(ab.byteLength),
        view = new Uint8Array(ab);
    for (var i = 0; i < buffer.length; ++i) { buffer[i] = view[i]; }
    return buffer;
}
