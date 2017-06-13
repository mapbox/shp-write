var zip = require('./zip');
var saveAs = require("file-saver").saveAs;

module.exports = function(gj, options) {
    zip(gj, options).then(function(blob) { saveAs(blob, options.file + '.zip'); });
};
