# maxcompressor

A simple site that compresses jpeg images to compression level 0 using libgd, send the result to the client and store it also on AWS S3.

Vincent Bruijn <vebruijn@gmail.com> (http://www.vincentbruijn.nl)
(c) 2014-2021

https://adrianhesketh.com/2021/06/14/go-cdk-app-runner/
https://nodejs.org/en/docs/guides/nodejs-docker-webapp/

Run in AWS App Runner and first upload docker image to AWS

```bash
$ docker build . -t vincentb/maxcompressor

$ docker run -p 8080:8080 -d vincentb/maxcompressor

$ docker exec -it 906b9880e70febeae857f818a1fdfd43446de359f59f4a54cac601f7aa0c6fe5 /bin/bash
```
