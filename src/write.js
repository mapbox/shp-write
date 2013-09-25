var types = require('./types');

module.exports = function write(geometries) {

    if (!geometries.length) return null;

    var TYPE = types.geometries[geometries[0].type.toUpperCase()];
    if (TYPE === undefined) return null;

    var shpHeaderBuf = new ArrayBuffer(100),
        shpHeaderView = new DataView(shpHeaderBuf),
        shxHeaderBuf = new ArrayBuffer(100),
        shxHeaderView = new DataView(shxHeaderBuf);

    writeEndian(shpHeaderView);
    writeEndian(shxHeaderView);

    // Little endian 32 bit int at byte 32 in both files gives shapetype
    shpHeaderView.setInt32(32, TYPE, true);
    shxHeaderView.setInt32(32, TYPE, true);

    // That's the fixed info, rest of header depends on contents. Start building contents now.
    // will get extent by naive method of increasing or decreasing the min / max for each feature
    // outside those currently set
    var extent = {
        xmin: Number.MAX_VALUE,
        ymin: Number.MAX_VALUE,
        xmax: -Number.MAX_VALUE,
        ymax: -Number.MAX_VALUE
    };

    // use the BlobBuilder polyfiller class to wrap WebkitBlobbuilder, MozBlobBuilder, or a fake blob
    // for each record we will create a buffer via a dataview, and append it to these blobs
    // This is fairly inefficient particularly for points where we could easily work out overall required
    // buffer length for all records first. But a bit clearer for now.

    // track overall length of files in bytes
    var byteFileLength = 100, // value is fixed 100 bytes from the header, plus the contents
        byteShxLength = 100,
        // 2 integers, same for all shape types
        recordHeaderLength = 8;

    if (TYPE === 1) {
        writePoints(geometries, recordHeaderLength);
    }

    writeExtent(extent, shpHeaderView);
    writeExtent(extent, shxHeaderView);

    // overall shp file length in 16 bit words at byte 24 of shp header
    shpHeaderView.setInt32(24, byteFileLength / 2);

    // overall shx file length in 16 bit words at byte 24 of shx header
    shxHeaderView.setInt32(24, (50 + numRecords * 4));

    return {
        successful: true,
        // shape: shapeFileBlobObject.getBlob(),
        // shx: shxFileBlobObject.getBlob()
    };
};

function enlargeExtent(extent, pt) {
    if (pt[0] < extent.xmin) extent.xmin = pt[0];
    if (pt[0] > extent.xmax) extent.xmax = pt[0];
    if (pt[1] < extent.ymin) extent.ymin = pt[1];
    if (pt[1] > extent.ymax) extent.ymax = pt[1];
}

function writePoints(geometries, extent, recordHeaderLength) {
    // 1 int + 2 doubles
    var recordLength = 20,
        totalLength = recordLength + recordHeaderLength;

    geometries.forEach(writePoint);

    function writePoint(geometry, i) {

        enlargeExtent(extent, geometry.coordinates);

        // we'll write the shapefile record header and content into a single arraybuffer
        var recordBuffer = new ArrayBuffer(totalLength);
        var recordDataView = new DataView(recordBuffer);
        recordDataView.setInt32(0, i); // big-endian value at byte 0 of header is record number

        // Byte 4 is length of record content only, in 16 bit words (divide by 2)
        recordDataView.setInt32(4, recordLength / 2); // always 20 / 2 = 10 for points

        //now the record content
        recordDataView.setInt32(8, TYPE, true); // 1=Point. LITTLE endian!
        recordDataView.setFloat64(12, x, true);
        recordDataView.setFloat64(20, y, true);

        // now do the shx record. NB no record header in shx, just fixed 8 byte records.
        var shxRecordBuffer = new ArrayBuffer(8);
        var shxRecordView = new DataView(shxRecordBuffer);

        // byte 0 of shx record gives offset in the shapefile of record start
        // byte 4 of shx record gives length of the record in the shapefile
        shxRecordView.setInt32(0, byteFileLength / 2);
        shxRecordView.setInt32(4, (recordLength / 2));

        // append the data to the content blobs, use the getBuffer convenience method rather
        // than the buffer object itself as if it's a mock (normal array) buffer it needs converting
        // to a string first
        // shapeContentBlobObject.append(recordDataView.getBuffer());
        // shxContentBlobObject.append(shxRecordView.getBuffer());
        byteFileLength += totalLength;
    }
}

function writeEndian(view) {
    view.setInt32(0, 9994);
    view.setInt32(28, 1000, true);
}

function writeExtent(extent, view) {
    view.setFloat64(36, extent.xmin, true);
    view.setFloat64(44, extent.ymin, true);
    view.setFloat64(52, extent.xmax, true);
    view.setFloat64(60, extent.ymax, true);
}
