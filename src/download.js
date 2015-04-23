var zip = require('./zip');

module.exports = function(gj, options) {
    var content = zip(gj, options);
    location.href = 'data:application/zip;base64,' + content;
};
