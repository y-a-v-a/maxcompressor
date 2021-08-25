var gd = require('node-gd');
var fs = require('fs');
var crypto = require('crypto');

const AWS = require('aws-sdk');

const s3 = new AWS.S3({
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

var md5 = function (str) {
  return crypto.createHash('md5').update(str).digest('hex');
};

exports.compress = function (image, callback) {
  'use strict';
  gd.openJpeg(image, function (err, img) {
    if (err) {
      throw err;
    }
    var newName = './cache/' + md5(image) + '.jpg';

    fs.exists(newName, function (exists) {
      if (!exists) {
        img.saveJpeg(newName, 0, function () {
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

exports.compressBuffer = function (buffer, name = '', callback) {
  const img = gd.createFromJpegPtr(buffer);
  if (img === null) {
    callback(new Error('No image!'), '');
    return false;
  }
  const data = Buffer.from(img.jpegPtr(0), 'binary');
  const fileName = !name.endsWith('.jpg') ? `-${name}.jpg` : `-${name}`;

  // AWS s3 params
  const params = {
    Bucket: 'maxcompressor',
    Key: `${md5(data.toString('ascii'))}${fileName}`,
    Body: data,
  };

  s3.upload(params, (error, s3Data) => {
    if (error) {
      console.log(error.message);
      callback(new Error('Unable to store image!'), '');
    } else {
      console.log(`File uploaded successfully at ${s3Data.Location}`);
      callback(null, data);
    }
  });
};
