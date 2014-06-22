var express = require('express');
var router = express.Router();

var compressor = require('../compressor/compressor');
/* GET home page. */
// router.get('/', function(req, res) {
//   res.render('index', { title: 'Express' });
// });

router.get('/', function(req, res) {
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