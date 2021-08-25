const express = require('express');
const router = express.Router();

const compressor = require('../compressor/compressor');

router.get('/', function (req, res) {
  res.render('index', {
    title: 'Max Kompressor',
    image: '/images/image.zero.jpg',
  });
});

router.post('/', function (req, res) {
  if (!req.body || !req.body.title) {
    new Error('No data provided.');
  }

  if (req?.files?.imageFile?.data) {
    const name =
      req.files.imageFile.name.replace(/[^0-9a-zA-Z\.]/, '').toLowerCase() ||
      '';

    compressor.compressBuffer(
      req.files.imageFile.data,
      name,
      function (err, img) {
        if (err) {
          res.redirect('/');
          return;
        }
        res.render('index', {
          title: 'Max Kompressor',
          image: `data:image/jpeg;base64,${img.toString('base64')}`,
        });
      }
    );
  } else {
    console.log('Empty form submission?');
    res.redirect('/');
  }
});

module.exports = router;
