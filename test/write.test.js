var expect = require('expect.js'),
    write = require('../src/write');

describe('write', function() {
    it('null with no features', function() {
        expect(write([])).to.eql(null);
    });

    describe('point', function() {
        it('point geometry', function() {
            expect(write([{
                type: 'Point',
                coordinates: [0, 0]
            }])).to.be.ok();
        });
    });

    describe('polyline', function() {
        it('polyline geometry', function() {
            expect(write([{
                type: 'PolyLine',
                coordinates: [[0, 0], [1, 2]]
            }])).to.be.ok();
        });
    });
});
