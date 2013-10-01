var expect = require('expect.js'),
    geojson = require('../src/geojson');

describe('geojson', function() {
    it('infers fields', function() {
        var inferred = geojson({
            type: 'FeatureCollection',
            features: [{
                type: 'Feature',
                geometry: {
                    type: 'Point',
                    coordinates: [0, 0]
                },
                properties: {
                    foo: 'bar'
                }
            }]
        });

        expect(inferred.fields).to.be.ok();
        expect(inferred.rows).to.be.ok();
        expect(inferred.geometries).to.be.ok();
    });
});
