var zip = require('./zip');
var saveAs = require("file-saver").saveAs;

module.exports = function (gj, options, zipOptions) {
  let filename = 'download';
  // since we only need a single filename object, we can use either the folder or
  // filename, depending on what was passed in
  if (options && (options.filename || options.folder)) {
    filename = (options.filename || options.folder);
  }
  zip(gj, options, zipOptions).then(function (blob) { saveAs(blob, filename + '.zip'); });
};
