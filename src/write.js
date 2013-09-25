var types = require('./types');

module.exports = function write(geometries) {

    if (!geometries.length) return null;

    var TYPE = types[geometries[0].type.toUpperCase()];
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
    var ext_xmin = Number.MAX_VALUE,
        ext_ymin = Number.MAX_VALUE,
        ext_xmax = -Number.MAX_VALUE,
        ext_ymax = -Number.MAX_VALUE;

    var numRecords = graphics.length;

    // use the BlobBuilder polyfiller class to wrap WebkitBlobbuilder, MozBlobBuilder, or a fake blob
    // for each record we will create a buffer via a dataview, and append it to these blobs
    // This is fairly inefficient particularly for points where we could easily work out overall required
    // buffer length for all records first. But a bit clearer for now.
    var shapeContentBlobObject = new BlobBuilder();
    var shxContentBlobObject = new BlobBuilder();

    // track overall length of files in bytes
    var byteFileLength = 100, // value is fixed 100 bytes from the header, plus the contents
        byteShxLength = 100,
        // 2 integers, same for all shape types
        byteLengthOfRecordHeader = 8;

    switch (shapetype) {
        case "POINT":
            // length of record is fixed at 20 for points, being 1 int and 2 doubles in a point record
            var byteLengthOfRecord = 20;
        var byteLengthOfRecordInclHeader = byteLengthOfRecord + byteLengthOfRecordHeader;
        for (var i = 1; i < numRecords + 1; i++) { // record numbers begin at 1 not 0
            var graphic = graphics[i - 1];
            var x = graphic.geometry.x;
            var y = graphic.geometry.y;
            if (x < ext_xmin)
                ext_xmin = x;
            if (x > ext_xmax)
                ext_xmax = x;
            if (y < ext_ymin)
                ext_ymin = y;
            if (y > ext_ymax)
                ext_ymax = y;
            // we'll write the shapefile record header and content into a single arraybuffer
            var recordBuffer = new ArrayBuffer(byteLengthOfRecordInclHeader);
            var recordDataView = new DataView(recordBuffer);
            recordDataView.setInt32(0, i); // big-endian value at byte 0 of header is record number
            // Byte 4 is length of record content only, in 16 bit words (divide by 2)
            recordDataView.setInt32(4, byteLengthOfRecord / 2); // always 20 / 2 = 10 for points
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
            shxRecordView.setInt32(4, (byteLengthOfRecord / 2));
            // append the data to the content blobs, use the getBuffer convenience method rather
            // than the buffer object itself as if it's a mock (normal array) buffer it needs converting
            // to a string first
            // shapeContentBlobObject.append(recordDataView.getBuffer());
            // shxContentBlobObject.append(shxRecordView.getBuffer());
            byteFileLength += byteLengthOfRecordInclHeader;
        }
        break;
        case "POLYLINE":
            case "POLYGON":
            // file structure is identical for lines and polygons, we just use a different shapetype and refer to
            // a different property of the input graphic
            for (var i = 1; i < numRecords + 1; i++) {
            var graphic = graphics[i - 1];
            var feat_xmin = Number.MAX_VALUE, feat_ymin = Number.MAX_VALUE, feat_xmax = -Number.MAX_VALUE, feat_ymax = -Number.MAX_VALUE;
            var numParts;
            if (shapetype == "POLYLINE") {
                numParts = graphic.geometry.paths.length;
            } else 
                if (shapetype == "POLYGON") {
                    numParts = graphic.geometry.rings.length;
                }
                var partsIndex = [];
                var pointsArray = [];
                for (var partNum = 0; partNum < numParts; partNum++) {
                    var thisPart = shapetype === "POLYLINE" ? graphic.geometry.paths[partNum] : graphic.geometry.rings[partNum];
                    var numPointsInPart = thisPart.length;
                    // record the index of where this part starts in the overall record's point array
                    partsIndex.push(pointsArray.length);
                    // add all the part's points to a single array for the record;
                    for (var pointIdx = 0; pointIdx < numPointsInPart; pointIdx++) {
                        pointsArray.push(thisPart[pointIdx]); // would just joining be quicker? still got to get indices 
                    }
                }
                var numPointsOverall = pointsArray.length;
                // now we know all we need in order to create the binary stuff. pointsarray contains the points in JS array
                // format and partsIndex is a JS array of the start indices in pointsarray 
                // NB: each "point" or rather vertex in shapefile is just 2 doubles, 16 bytes 
                // (not a full "point" record! not clear in shapefile docs!)
                var pointsArrayBuf = jDataView_write.createEmptyBuffer(16 * numPointsOverall);
                var pointsArrayView = new jDataView_write(pointsArrayBuf);
                for (var pointIdx = 0; pointIdx < numPointsOverall; pointIdx += 1) {
                    // each item in pointsArray should be an array of two numbers, being x and y coords
                    var thisPoint = pointsArray[pointIdx];
                    pointsArrayView.setFloat64(pointIdx * 16, thisPoint[0], true); //little-endian
                    pointsArrayView.setFloat64(pointIdx * 16 + 8, thisPoint[1], true); //little-endian
                    // check and update feature box / extent if necessary
                    if (thisPoint[0] < feat_xmin) {
                        feat_xmin = thisPoint[0];
                    }
                    if (thisPoint[0] > feat_xmax) {
                        feat_xmax = thisPoint[0];
                    }
                    if (thisPoint[1] < feat_ymin) {
                        feat_ymin = thisPoint[1];
                    }
                    if (thisPoint[1] > feat_ymax) {
                        feat_ymax = thisPoint[1];
                    }
                }
                // length of record contents excluding the vertices themselves is 44 + 4*numparts
                // we add another 8 for the record header which we haven't done separately, hence offsets
                // below are 8 higher than in shapefile specification (table 6)
                var recordInfoLength = 8 + 44 + 4 * numParts,
                    // amount that file length is increased by
                    byteLengthOfRecordInclHeader = recordInfoLength + 16 * numPointsOverall,
                    // value to use in shp record header and in shx record
                    byteLengthOfRecordContent = byteLengthOfRecordInclHeader - 8;

                // buffer to contain the record header plus the descriptive parts of the record content,
                // effectively these are header too i reckon
                var shpRecordInfo = jDataView_write.createEmptyBuffer(recordInfoLength);
                var shpRecordInfoView = new jDataView_write(shpRecordInfo);
                shpRecordInfoView.setInt32(0, i);
                shpRecordInfoView.setInt32(4, (byteLengthOfRecordContent / 2));//value is in 16 bit words
                // that's the 8 bytes of record header done, now add the shapetype, box, numparts, and numpoints
                // add 8 to all offsets given in shapefile doc to account for header
                // all numbers in the record itself are little-endian
                shpRecordInfoView.setInt32(8, TYPE, true);
                shpRecordInfoView.setFloat64(12, feat_xmin, true);
                shpRecordInfoView.setFloat64(20, feat_ymin, true);
                shpRecordInfoView.setFloat64(28, feat_xmax, true);
                shpRecordInfoView.setFloat64(36, feat_ymax, true);
                shpRecordInfoView.setInt32(44, numParts, true);
                shpRecordInfoView.setInt32(48, numPointsOverall, true);
                // now write in the indices of the part starts
                for (var partNum = 0; partNum < partsIndex.length; partNum++) {
                    shpRecordInfoView.setInt32(52 + partNum * 4, partsIndex[partNum], true);
                }
                //now featureRecordInfo and pointsArrayBuf together contain the complete feature
                // now do the shx record
                var shxBuffer = jDataView_write.createEmptyBuffer(8);
                var shxDataView = new jDataView_write(shxBuffer);
                shxDataView.setInt32(0, byteFileLength / 2);
                shxDataView.setInt32(4, byteLengthOfRecordContent / 2);
                shapeContentBlobObject.append(shpRecordInfoView.getBuffer());
                shapeContentBlobObject.append(pointsArrayView.getBuffer());
                shxContentBlobObject.append(shxDataView.getBuffer());
                if (feat_xmax > ext_xmax) 
                    ext_xmax = feat_xmax;
                if (feat_xmin < ext_xmin) 
                    ext_xmin = feat_xmin;
                if (feat_ymax > ext_ymax) 
                    ext_ymax = feat_ymax;
                if (feat_ymin < ext_ymin) 
                    ext_ymin = feat_ymin;
                // finally augment the overall file length tracker
                byteFileLength += byteLengthOfRecordInclHeader;
        }
        break;
        default:
            return ({
            successful: false,
            message: "unknown shape type specified"
        });
    }

    shpHeaderView.setFloat64(36, ext_xmin, true);
    shpHeaderView.setFloat64(44, ext_ymin, true);
    shpHeaderView.setFloat64(52, ext_xmax, true);
    shpHeaderView.setFloat64(60, ext_ymax, true);
    shxHeaderView.setFloat64(36, ext_xmin, true);
    shxHeaderView.setFloat64(44, ext_ymin, true);
    shxHeaderView.setFloat64(52, ext_xmax, true);
    shxHeaderView.setFloat64(60, ext_ymax, true);

    // overall shp file length in 16 bit words at byte 24 of shp header
    shpHeaderView.setInt32(24, byteFileLength / 2);

    // overall shx file length in 16 bit words at byte 24 of shx header
    shxHeaderView.setInt32(24, (50 + numRecords * 4));

    // all done. make and return the final blob objects
    // var shapeFileBlobObject = new BlobBuilder();
    // shapeFileBlobObject.append(shpHeaderView.getBuffer());
    // shapeFileBlobObject.append(shapeContentBlobObject.getBlob());

    // var shxFileBlobObject = new BlobBuilder();
    // shxFileBlobObject.append(shxHeaderView.getBuffer());
    // shxFileBlobObject.append(shxContentBlobObject.getBlob());

    return {
        successful: true,
        // shape: shapeFileBlobObject.getBlob(),
        // shx: shxFileBlobObject.getBlob()
    };
};

function writeEndian(view) {
    view.setInt32(0, 9994);
    view.setInt32(28, 1000, true);
}
