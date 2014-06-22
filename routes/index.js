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
            'Content-Type': 'image/jpg',
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
        var converter = new stream.Writable();
        converter.data = [];
        converter._write = function (chunk) {
          this.data.push(chunk);
        };
        
        file.pipe(converter);
        file.on('end', function() {
          buffer = Buffer.concat(converter.data);
          compressor.compressBuffer(buffer, function(err, img) {
              res.set({
                  'Content-Type': 'image/jpg',
                  'Content-Length': img.length
              })

              res.send(img);
          });
        });
    });
});

module.exports = router;