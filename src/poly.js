var ext = require('./extent');

module.exports.writePolygons = function writePolygons(geometries, extent, fileLength) {
    var graphic = graphics[i - 1],
        numParts;
        featureExtent = {
            xmin: Number.MAX_VALUE,
            ymin: Number.MAX_VALUE,
            xmax: -Number.MAX_VALUE,
            ymax: -Number.MAX_VALUE
        };

    for (var partNum = 0; partNum < numParts; partNum++) {
        var thisPart = shapetype === "POLYLINE" ? graphic.geometry.paths[partNum] : graphic.geometry.rings[partNum];
        var numPointsInPart = thisPart.length;
        partsIndex.push(pointsArray.length);
        for (var pointIdx = 0; pointIdx < numPointsInPart; pointIdx++) {
            pointsArray.push(thisPart[pointIdx]);
        }
    }

    var numPointsOverall = pointsArray.length;

    // now we know all we need in order to create the binary stuff.
    // format and partsIndex is a JS array of the start indices in pointsarray
    // NB: each "point" or rather vertex in shapefile is just 2 doubles, 16 bytes
    // (not a full "point" record! not clear in shapefile docs!)
    var pointsArrayBuf = new ArrayBuffer(16 * numPointsOverall),
        pointsArrayView = new DataView(pointsArrayBuf);

    for (var pointIdx = 0; pointIdx < numPointsOverall; pointIdx += 1) {
        // each item in pointsArray should be an array of two numbers, being x and y coords
        var thisPoint = pointsArray[pointIdx];
        pointsArrayView.setFloat64(pointIdx * 16, thisPoint[0], true);
        pointsArrayView.setFloat64(pointIdx * 16 + 8, thisPoint[1], true);
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
    var recordInfoLength = 8 + 44 + 4 * numParts;
    // amount that file length is increased by
    var byteLengthOfRecordInclHeader = recordInfoLength + 16 * numPointsOverall;
    // value to use in shp record header and in shx record
    var byteLengthOfRecordContent = byteLengthOfRecordInclHeader - 8;

    var shpRecordInfo = new ArrayBuffer(recordInfoLength),
        shpRecordInfoView = new DataView(shpRecordInfo);

    shpRecordInfoView.setInt32(0, i);
    shpRecordInfoView.setInt32(4, (byteLengthOfRecordContent / 2));

    // that's the 8 bytes of record header done, now add the shapetype, box, numparts, and numpoints
    // add 8 to all offsets given in shapefile doc to account for header
    // all numbers in the record itself are little-endian
    shpRecordInfoView.setInt32(8, ShapeTypes[shapetype], true);
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

    // now featureRecordInfo and pointsArrayBuf together contain the complete feature
    var shxBuffer = new ArrayBuffer(8),
        shxDataView = new DataView(shxBuffer);

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
};
