var shpWrite = require('./').download;

shpWrite({
    type: 'FeatureCollection',
    features: [
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 0]
            },
            properties: {
                name: 'Foo'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Point',
                coordinates: [0, 10]
            },
            properties: {
                name: 'Bar'
            }
        }
    ]
});
