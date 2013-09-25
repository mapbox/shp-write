var ext = require('./extent');

var recordHeaderLength = 8;

module.exports = function writePoints(geometries, extent, fileLength) {

    var recordLength = 20,
        shpBuffers = [],
        shxBuffers = [],
        totalLength = recordLength + recordHeaderLength;

    geometries.forEach(writePoint);

    function writePoint(geometry, i) {
        var coords = geometry.coordinates;

        ext.enlarge(extent, coords);

        var recordBuffer = new ArrayBuffer(totalLength),
            recordDataView = new DataView(recordBuffer),
            shxRecordBuffer = new ArrayBuffer(8),
            shxRecordView = new DataView(shxRecordBuffer);

        recordDataView.setInt32(0, i);
        recordDataView.setInt32(4, 10);

        recordDataView.setInt32(8, 1, true);
        recordDataView.setFloat64(12, coords[0], true);
        recordDataView.setFloat64(20, coords[1], true);

        shxRecordView.setInt32(0, fileLength / 2);
        shxRecordView.setInt32(4, 10);

        shpBuffers.push(recordBuffer);
        shxBuffers.push(shxRecordBuffer);
        fileLength += totalLength;
    }

    return {
        fileLength: fileLength,
        shpBuffers: shpBuffers,
        shxBuffers: shxBuffers
    };
};
