var expect = require('expect.js'),
    write = require('../src/write').write;

describe('write', function() {

    describe('point', function() {
        it('point geometry', function(done) {
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
                expect(err).to.be.null;
                expect(files.shp).to.be.ok;
                expect(files.shx).to.be.ok;
                expect(files.dbf).to.be.ok;
                done();
            }
        });
    });
});
