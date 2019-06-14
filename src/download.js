var zip = require('./zip');

module.exports = function(gj, options) {
    var content = zip(gj, options);
    saveAs('data:application/zip;base64,' + content, options.folder + ".zip");
    //location.href = 'data:application/zip;base64,' + content;
};

function saveAs(uri, filename) {
    var link = document.createElement('a');
    if (typeof link.download === 'string') {
        link.href = uri;
        link.download = filename;

        //Firefox requires the link to be in the body
        document.body.appendChild(link);

        //simulate click
        link.click();

        //remove the link when done
        document.body.removeChild(link);
    } else {
        window.open(uri);
    }
}