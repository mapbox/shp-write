var zip = require('./zip');
var FileSaver = require('file-saver');

module.exports = function(gj, options) {
    zip(gj, options)
        .then(content => {
            options = options ? options : {};
            const filename = options.filename ? `${options.filename}.zip` : "download.zip";
            FileSaver.saveAs(content, filename);
        });
};
