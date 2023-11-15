var expect = require("expect.js"),
  zip = require("../src/zip"),
  path = require("path"),
  fs = require("fs");

describe("zip", function () {
  describe("#polyline", function () {
    it("1. multi-feature polyline with associated feature data", async function () {
      const options = {
        outputType: "blob",
        compression: "STORE",
      };

      var geojson = {
        type: "FeatureCollection",
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [0, 0],
                [10, 0],
              ],
            },
            properties: {
              name: "Foo",
            },
          },
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: [
                [0, 10],
                [10, 10],
              ],
            },
            properties: {
              name: "Bar",
            },
          },
        ],
      };

      const zippedShapefile = await zip(geojson, options);

      const testFile = path.join("test", "comparison_files", "zip_polyline_1_test.zip");
      const sourceFile = path.join("test", "comparison_files", "zip_polyline_1.zip");

      await new Promise(async function (resolve, reject) {
        fs.writeFile(testFile, Buffer.from(await zippedShapefile.arrayBuffer()), () => resolve("saved"));
      });

      const testFileData = fs.readFileSync(testFile).toString();
      const sourceFileData = fs.readFileSync(sourceFile).toString();
      expect(testFileData).to.equal(sourceFileData);

      fs.rmSync(testFile);
    });
  });
});
