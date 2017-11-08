var expect = require('expect.js'),
    extent = require('../src/extent');

describe('extent', function() {

    describe('#blank', function() {
        it('creates an ext', function() {
            var ext = extent.blank();
            expect(ext.xmin).to.be.ok();
            expect(ext.ymin).to.be.ok();
            expect(ext.xmax).to.be.ok();
            expect(ext.ymax).to.be.ok();
            expect(ext.zmin).to.be.ok();
            expect(ext.mmin).to.be.ok();
            expect(ext.zmax).to.be.ok();
            expect(ext.mmax).to.be.ok();
        });
    });

    describe('#enlarge', function() {
        it('encloses a point', function() {
            var ext = extent.blank();
            extent.enlarge(ext, [0, 0, 1, 2]);
            expect(ext.xmin).to.eql(0);
            expect(ext.ymin).to.eql(0);
            expect(ext.xmax).to.eql(0);
            expect(ext.ymax).to.eql(0);
            expect(ext.zmin).to.eql(1);
            expect(ext.mmin).to.eql(2);
            expect(ext.zmax).to.eql(1);
            expect(ext.mmax).to.eql(2);
        });
    });

    describe('#enlargeExtent', function() {
        it('encloses a extent', function() {
            var ext = extent.blank(),
                extB = extent.blank();
            extent.enlarge(ext, [0, 0, 0, 0]);
            extent.enlarge(ext, [10, 10, 10, 10]);
            extent.enlargeExtent(extB, ext);
            expect(ext.xmin).to.eql(0);
            expect(ext.ymin).to.eql(0);
            expect(ext.xmax).to.eql(10);
            expect(ext.ymax).to.eql(10);
            expect(ext.zmin).to.eql(0);
            expect(ext.mmin).to.eql(0);
            expect(ext.zmax).to.eql(10);
            expect(ext.mmax).to.eql(10);
        });
    });
});
