var express = require('express');
var router = express.Router();
var http = require("http");
var https = require("https");

var stream = require('stream');
var config = require('./../config.js');

var compressor = require('../compressor/compressor');

function getConverter() {
    var converter = new stream.Writable({ highWaterMark: 65536 }); // 64kb
    converter.data = [];
    converter._write = function (chunk, encoding, cb) {
        var curr = this.data.push(chunk);
        if (curr !== this.data.length) {
            return cb(new Error('Error pushing buffer to stack'));
        } else {
            // calling the callback when having success appears to be required!
            // Node.js doc:
            // Call the callback using the standard callback(error) pattern to signal
            // that the write completed successfully or with an error.
            cb(null);
        }
    };
    return converter;
}

router.get('/', function(req, res) {
    res.render('index', {
        title: 'Max Kompressor',
        image: '/images/image.zero.jpg'
    });
});

router.post('/', function(req, res) {
    if (!req.body || !req.body.title) {
        new Error('No data provided.');
    }
    var hasData = false;

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
            console.log('Done reading file ' + filename);
            hasData = true;
            compressor.compressBuffer(buffer, function(err, img) {
                res.render('index', {
                    title: 'Max Kompressor',
                    image: img.replace('./cache', '')
                });
            });
        });
    });

    req.busboy.on('field', function(fieldname, val, fieldnameTruncated, valTruncated) {
        var protocol = http;
        if (val.length === 0 || !/^http/.test(val)) {
            return;
        }
        var imageUrl = val.trim();
        var buffer;

        if (/^https/.test(imageUrl)) {
          protocol = https;
        }

        hasData = true;

        protocol.get(imageUrl, function(response) {
            var converter = getConverter();

            response.on('data', function (chunk) {
                converter.write(chunk);
            });

            response.on("end", function() {
                console.log('Done retrieving ' + imageUrl);
                buffer = Buffer.concat(converter.data);

                compressor.compressBuffer(buffer, function(err, img) {
                    if (err) {
                        console.log(err);
                        res.redirect('/');
                    }
                   // postToTumblr(img);
                   res.render('index', {
                       title: 'Max Kompressor',
                       image: img.replace('./cache', '')
                   });
                });
            });
        }).on('error', function(e) {
            console.log('Error ' + e);
            res.redirect('/');
        });
    });

    req.busboy.on('finish', function() {
        if (hasData === false) {
            console.log('Empty form submission?');
            res.redirect('/');
        }
    });
});

module.exports = router;

function postToTumblr(image, tags) {
    var tumblr = require('tumblr.js');

    var client = tumblr.createClient({
      consumer_key:    config.consumer_key,
      consumer_secret: config.consumer_secret,
      token:           config.token,
      token_secret:    config.token_secret
    });

    var options = {
        data: image,
        date: '' + ~~(Date.now() / 1000),
        state: 'draft'
    };

    client.photo('y-a-v-a', options, function(a, b) {
        console.log(b.id);
    });
}
