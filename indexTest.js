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
                    ],
                    [
                        [
                            24.93523120880127,
                            60.169247224327165
                        ],
                        [
                            24.945573806762695,
                            60.15874243076889
                        ],
                        [
                            24.928064346313477,
                            60.15825127085746
                        ],
                        [
                            24.93523120880127,
                            60.169247224327165
                        ]
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "LineString",
                "coordinates": [
                    [
                        24.920940399169922,
                        60.17977000114811
                    ],
                    [
                        24.953556060791016,
                        60.17486121440947
                    ]
                ]
            }
        },
        {
            "type": "Feature",
            "properties": {},
            "geometry": {
                "type": "Point",
                "coordinates": [
                    24.925403594970703,
                    60.171830205844614
                ]
            }
        }
    ]
}, {
    fileName: 'shapefiles',
    folder: 'shapefiles',
    types: {
        point: 'points',
        polygon: 'polygons',
        polyline: 'lines'
    }
});
