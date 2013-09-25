module.exports.enlarge = function enlargeExtent(extent, pt) {
    if (pt[0] < extent.xmin) extent.xmin = pt[0];
    if (pt[0] > extent.xmax) extent.xmax = pt[0];
    if (pt[1] < extent.ymin) extent.ymin = pt[1];
    if (pt[1] > extent.ymax) extent.ymax = pt[1];
};
