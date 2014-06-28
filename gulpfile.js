// Include gulp
var gulp = require('gulp'); 

// Include Our Plugins
var jshint = require('gulp-jshint');

var paths = ['*.js', 'compressor/*.js', 'routes/*.js'];

// Lint Task
gulp.task('lint', function() {
    return gulp.src(paths)
        .pipe(jshint())
        .pipe(jshint.reporter('default'));
});

// Watch Files For Changes
gulp.task('watch', function() {
    gulp.watch(paths, ['lint']);
});

// Default Task
gulp.task('default', ['lint', 'watch']);