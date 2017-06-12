require('./src/download')({
    "type": "FeatureCollection",
    "features": [{
        "type": "Feature",
        "properties": {},
        "geometry": {
            "type": "Polygon",
            "coordinates": [
                [
                    [
                        24.936046600341797,
                        60.175245406790246
                    ],
                    [
                        24.920597076416016,
                        60.15577400466598
                    ],
                    [
                        24.953556060791016,
                        60.1570553725571
                    ],
                    [
                        24.936046600341797,
                        60.175245406790246
                    ]
                ]
            ]
        }
    }]
}, {
    fileName: 'shapefiles',
    folder: 'shapefiles',
    types: {
        point: 'points',
        polygon: 'polygons',
        line: 'lines'
    }
});
