var express = require('express');
var router = express.Router();
var stream = require('stream');

var compressor = require('../compressor/compressor');

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
    req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
        var buffer;
        var converter = new stream.Writable({ highWaterMark: 65536 });
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

        file.on('data', function(chunk) {
            var success = converter.write(chunk, '7bit', function(err) {
                if (err) {
                    throw err;
                }
            });
        });
        
        file.on('end', function() {
            buffer = Buffer.concat(converter.data);
            compressor.compressBuffer(buffer, function(err, img) {
                res.set({
                    'Content-Type': 'image/jpeg',
                    'Content-Length': img.length
                });
                res.send(img);
            });
        });
    });
});

module.exports = router;