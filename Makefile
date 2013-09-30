bundle.js: dl.js src/geojson.js src/download.js
	browserify dl.js > bundle.js
