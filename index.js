var gd = require('node-gd');

var image = './image.jpg';

gd.openJpeg(image, function(err, img) {
    if (err) {
        throw err;
    }
    
    return img.saveJpeg('./image1.jpg', 0, function(err) {
        if (err) {
            throw err;
        }
        return console.log('saved!');
    });
});
