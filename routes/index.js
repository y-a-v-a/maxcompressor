var express = require('express');
var router = express.Router();

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

module.exports = router;