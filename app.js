var path = require('path');
var express = require('express');
var logger = require('morgan');

var app = express();

var favicon = require('static-favicon');
var busboy = require('connect-busboy');

var routes = require('./routes/index');

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(favicon());
app.use(busboy({
    immediate: true,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
}));

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'cache')));

app.use('/', routes);

/// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

app.set('port', 3000);


var server = app.listen(app.get('port'), function() {
  console.log('Express server listening on port ' + server.address().port);
});
