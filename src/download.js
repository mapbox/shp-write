var zip = require('./zip');

module.exports = function(gj, options) {
    var content = zip(gj, options);

    var link = document.createElement('a');
    link.href = 'data:application/zip;base64,' + content;
    link.rel = 'noopener'
    if (options && options.filename || options.folder) {
      link.download = (options.filename || options.folder) + '.zip';
    }
    link.click();
    delete link;
};
