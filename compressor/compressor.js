var gd = require('node-gd');

var fs = require('fs');

exports.compress = function() {
    'use strict';
    var image, asData, callback, i = 0, j = arguments.length, data, args = new Array();
    for (;i < j; i++) {
        args.push(arguments[i]);
    }

    image = args[0];
    asData = args[1] === true;
    callback = args[j - 1];

    gd.openJpeg(image, function(err, img) {
        if (err) {
            throw err;
        }
        if (asData && typeof callback === 'function') {
            data = new Buffer(img.jpegPtr(0), 'binary');
            
            callback.call(null, data);
        } else {
            var newName = image.replace(/\.jpg$/, '.zero.jpg');
            img.saveJpeg('./' + newName, 0);
            if (typeof callback === 'function') {
                callback.call(null, newName);
            }
        }
    });
};

exports.compressBuffer = function(buffer, callback) {
    'use strict';
    var img = gd.createFromJpegPtr(buffer);
    var data = new Buffer(img.jpegPtr(0), 'binary');
    if (typeof callback === 'function') {
        callback.call(null, null, data);
    }
};