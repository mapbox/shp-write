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
                foo: 'bar'
            }
        },
        {
            type: 'Feature',
            geometry: {
                type: 'Polygon',
                coordinates:
                    [[0, 0], [2, -10], [5, 10], [0,0]]
            },
            properties: {
                foo: 'blah'
            }
        },
    ]
});
