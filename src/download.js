var zip = require('./zip');

module.exports = function(gj, options) {
    var content = zip(gj, options);
    content.then(function(abc){ 
      var element = document.createElement('a');
      element.setAttribute('href', 'data:application/zip;base64,' + abc);
      element.setAttribute('download', options.folder+".zip");
      element.style.display = 'none';
      document.body.appendChild(element);
      element.click();
      document.body.removeChild(element);
    });
};
