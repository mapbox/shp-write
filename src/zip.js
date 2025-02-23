var write = require("./write");
var geojson = require("./geojson");
var defaultPrj = require('./prj');
var JSZip = require("jszip");


module.exports = function (
  gj,
  options,
  stream = false
) {
  let zip = new JSZip();
  let zipTarget = zip;
  if (options && options.folder) {
    zipTarget = zip.folder(options.folder);
  }

  var prj = (options && options.prj) ? options.prj : defaultPrj;

  [
    [geojson.point(gj)],
    [geojson.line(gj), geojson.multiline(gj)],
    [geojson.polygon(gj), geojson.multipolygon(gj)],
    ].forEach(function (l) {
    if ((l[0].geometries.length && l[0].geometries[0].length) || l[1] && l[1].geometries.length && l[1].geometries[0].length) {
 
        const properties = l.flatMap(l => l.properties);
        const geometries = l.flatMap(l => l.geometries);
        const type = l[0].type;
 
        write(
        // field definitions
        properties,
        // geometry type
        l[0].type,
        // geometries
        geometries,
        function (err, files) {
          var fileName =
            options && options.types && options.types[type.toLowerCase()]
              ? options.types[type.toLowerCase()]
              : type;
          zipTarget.file(fileName + ".shp", files.shp.buffer, { binary: true });
          zipTarget.file(fileName + ".shx", files.shx.buffer, { binary: true });
          zipTarget.file(fileName + ".dbf", files.dbf.buffer, { binary: true });
          zipTarget.file(fileName + ".prj", prj);
        }
      );
    }
  });

  var zipOptions = {};
  if (!options || !options.outputType) {
    zipOptions.type = "base64";
  } else {
    zipOptions.type = options.outputType;
  }

  if (!options || !options.compression) {
    zipOptions.compression = "DEFLATE";
  } else {
    zipOptions.compression = options.compression;
  }

  if (stream) {
    return zip.generateNodeStream({ ...zipOptions, streamFiles: true });
  }

  return zip.generateAsync(zipOptions);
};
