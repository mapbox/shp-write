var zip = require('./zip');

module.exports = function(gj, options) {
    zip(gj, options).then(function(content) {
      location.href = 'data:application/zip;base64,' + content;
    });
  };