var express = require('express');
var router = express.Router();
var stream = require('stream');

var compressor = require('../compressor/compressor');

function getConverter() {
    var converter = new stream.Writable({ highWaterMark: 65536 }); // 64kb
    converter.data = [];
    converter._write = function (chunk, encoding, callback) {
        var curr = this.data.push(chunk);
        if (curr !== this.data.length) {
            callback(new Error('Error pushing buffer to stack'));
        } else {
            // calling the callback when having success appears to be required!
            callback(null);
        }
    };
    return converter;
}

router.get('/', function(req, res) {
    res.render('index', { title: 'Maxcompressor' });
});

router.get('/zero.jpg', function(req, res) {
    var binary = true;
    compressor.compress('./public/images/image.jpg', binary, function(data) {
        res.set({
            'Content-Type': 'image/jpeg',
            'Content-Length': data.length
        })

        res.send(data);
    });
});

router.post('/', function(req, res) {
    if (!req.body || !req.body.title) {
        new Error('No data provided.');
    }

    function doSend(image) {
        if (image !== undefined) {
            res.set({
                'Content-Type': 'image/jpeg',
                'Content-Length': image.length
            });
            res.send(image);
        } else {
            res.send('Image is undefined');
        }
        res.end();
    }

    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        if (filename.length === 0) {
            file.resume();
            return;
        }
        var buffer;
        var converter = getConverter();

        file.on('data', function(chunk) {
            converter.write(chunk);
        });

        file.on('end', function() {
            buffer = Buffer.concat(converter.data);
            compressor.compressBuffer(buffer, function(err, img) {
                doSend(img);
            });
        });
    });

    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        if (val.length === 0 || !/^http/.test(val)) {
            return;
        }
        var imageUrl = val.trim();
        var buffer;
        var http = require("http");

        http.get(imageUrl, function(res) {
            var converter = getConverter();

            res.on('data', function (chunk) {
                converter.write(chunk);
            });

            res.on("end", function() {
                buffer = Buffer.concat(converter.data);
                compressor.compressBuffer(buffer, function(err, img) {
                    if (err) {
                        throw err;
                    }
                    doSend(img);
                });
            });
        }).on('error', function(e) {
            console.log('Error ' + e);
        });
    });
});

module.exports = router;