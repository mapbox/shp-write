module.exports.enlarge = function enlargeExtent(extent, pt) {
    if (pt[0] < extent.xmin) extent.xmin = pt[0];
    if (pt[0] > extent.xmax) extent.xmax = pt[0];
    if (pt[1] < extent.ymin) extent.ymin = pt[1];
    if (pt[1] > extent.ymax) extent.ymax = pt[1];
    if ((pt[2] || 0) < extent.zmin) extent.zmin = pt[2] || 0;
    if ((pt[2] || 0) > extent.zmax) extent.zmax = pt[2] || 0;
    if ((pt[3] || 0) < extent.mmin) extent.mmin = pt[3] || 0;
    if ((pt[3] || 0) > extent.mmax) extent.mmax = pt[3] || 0;
    return extent;
};

module.exports.enlargeExtent = function enlargeExtent(extent, ext) {
    if (ext.xmax > extent.xmax) extent.xmax = ext.xmax;
    if (ext.xmin < extent.xmin) extent.xmin = ext.xmin;
    if (ext.ymax > extent.ymax) extent.ymax = ext.ymax;
    if (ext.ymin < extent.ymin) extent.ymin = ext.ymin;
    if (ext.zmax && ext.zmax > extent.zmax) extent.zmax = ext.zmax;
    if (ext.zmin && ext.zmin < extent.zmin) extent.zmin = ext.zmin;
    if (ext.mmax && ext.mmax > extent.mmax) extent.mmax = ext.mmax;
    if (ext.mmin && ext.mmin < extent.mmin) extent.mmin = ext.mmin;
    return extent;
};

module.exports.blank = function() {
    return {
        xmin: Number.MAX_VALUE,
        ymin: Number.MAX_VALUE,
        zmin: Number.MAX_VALUE,
        mmin: Number.MAX_VALUE,
        xmax: -Number.MAX_VALUE,
        ymax: -Number.MAX_VALUE,
        zmax: -Number.MAX_VALUE,
        mmax: -Number.MAX_VALUE
    };
};
