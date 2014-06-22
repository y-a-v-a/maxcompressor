var express = require('express');
var app = express();

var compressor = require('./compressor/compressor');


app.get('/', function(req, res) {
    var binary = true;
    compressor.compress('./image.jpg', binary, function(data) {
        res.set({
            'Content-Type': 'image/jpg',
            'Content-Length': data.length
        })

        res.send(data);
    });
});

app.listen(3000);


