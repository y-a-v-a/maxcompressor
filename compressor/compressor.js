var gd = require('node-gd');
var fs = require('fs');
var crypto = require('crypto');

var md5 = function(str) {
  return crypto
    .createHash('md5')
    .update(str)
    .digest('hex');
};

exports.compress = function(image, callback) {
    'use strict';
    gd.openJpeg(image, function(err, img) {
        if (err) {
            throw err;
        }
        var newName = './cache/' + md5(image) + '.jpg';

        fs.exists(newName, function(exists) {
            if (!exists) {
                img.saveJpeg(newName, 0, function() {
                    if (typeof callback === 'function') {
                        callback(null, newName);
                    }
                });
            } else {
                callback(null, newName);
            }
        });
    });
};

exports.compressBuffer = function(buffer, callback) {
    'use strict';
    var img = gd.createFromJpegPtr(buffer);
    if (img === null) {
        callback(new Error('No image!'), '');
        return false;
    }
    var data = new Buffer(img.jpegPtr(0), 'binary');
    var newName = './cache/' + md5(data.toString('ascii')) + '.jpg';
    fs.exists(newName, function(exists) {
        if (!exists) {
            img.saveJpeg(newName, 0);
        }
        callback(null, newName);
    });
};