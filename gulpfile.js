var gulp = require('gulp');
var $ = require('gulp-load-plugins')({lazy: true});
var config = require('./gulp.config')();
var sass = require('gulp-sass');

/**
 * Compile SASS to CSS
 */
gulp.task('styles', function(done) {
    gulp.src(config.styles)
        .pipe(sass())
        .pipe(gulp.dest(config.temp))
        .on('end', done);
});

/**
 * Watch the styles for changes.
 */
gulp.task('watch', function () {
    gulp.watch([config.styles], ['styles']);
});