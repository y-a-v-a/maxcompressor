# maxcompressor

A simple site that compresses jpeg images to compression level 0 using libgd.

Vincent Bruijn <vebruijn@gmail.com> (http://www.vincentbruijn.nl)

### Notes

- Should we use https://github.com/flatiron/nconf for storing external configuration?
- Add a config.js file containing an object with configuration for Tumblr.
- Comment out the line that calls the Tumblr connection

```javascript
module.exports = {
  consumer_key: 'xyz',
  consumer_secret: 'abc',
  token: 'def',
  token_secret: 'uvw',
};
```

https://adrianhesketh.com/2021/06/14/go-cdk-app-runner/

https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

Run in AWS App Runner and first upload docker image to AWS
