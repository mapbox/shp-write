var zip = require('./zip');

module.exports = function(gj) {
    var content = zip(gj);
    location.href = 'data:application/zip;base64,' + content;
};
