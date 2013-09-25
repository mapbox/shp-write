var ext = require('./extent');

module.exports.writePolygons = function writePolygons(geometries, extent, fileLength) {

    geometries.forEach(writePolygon);

    return fileLength;

    function writePolygon(geometry) {
        var graphic = graphics[i - 1],
            coords = geometry.coordinates,
            featureExtent = {
                xmin: Number.MAX_VALUE,
                ymin: Number.MAX_VALUE,
                xmax: -Number.MAX_VALUE,
                ymax: -Number.MAX_VALUE
            },
            pointsArrayBuf = new ArrayBuffer(16 * numPointsOverall),
            pointsArrayView = new DataView(pointsArrayBuf);

        coords.forEach(writeCoordinate);

        var recordInfoLength = 8 + 44 + 4 * numParts,
            byteLengthOfRecordInclHeader = recordInfoLength + 16 * numPointsOverall,
            byteLengthOfRecordContent = byteLengthOfRecordInclHeader - 8,
            shpRecordInfo = new ArrayBuffer(recordInfoLength),
            shpRecordInfoView = new DataView(shpRecordInfo);

        shpRecordInfoView.setInt32(0, i);
        shpRecordInfoView.setInt32(4, (byteLengthOfRecordContent / 2));

        shpRecordInfoView.setInt32(8, ShapeTypes[shapetype], true);
        writeExtent(view, featureExtent);
        shpRecordInfoView.setInt32(44, numParts, true);
        shpRecordInfoView.setInt32(48, numPointsOverall, true);

        // now write in the indices of the part starts
        for (var partNum = 0; partNum < partsIndex.length; partNum++) {
            shpRecordInfoView.setInt32(52 + partNum * 4, partsIndex[partNum], true);
        }

        var shxBuffer = new ArrayBuffer(8),
            shxDataView = new DataView(shxBuffer);

        shxDataView.setInt32(0, fileLength / 2);
        shxDataView.setInt32(4, byteLengthOfRecordContent / 2);

        ext.enlargeExtent(extent, featureExtent);

        fileLength += byteLengthOfRecordInclHeader;

        function writeCoordinate(pt) {
            pointsArrayView.setFloat64(pointIdx * 16, pt[0], true);
            pointsArrayView.setFloat64(pointIdx * 16 + 8, pt[1], true);
            ext.enlarge(featureExtent, pt);
        }
    }
};

function writeExtent(extent, view) {
    view.setFloat64(12, extent.xmin, true);
    view.setFloat64(20, extent.ymin, true);
    view.setFloat64(28, extent.xmax, true);
    view.setFloat64(36, extent.ymax, true);
}
