var gulp = require('gulp');
var args = require('yargs').argv;
var $ = require('gulp-load-plugins')({lazy: true});
var config = require('./gulp.config')();
var sass = require('gulp-sass');
var del = require('del');
var runSequence = require('run-sequence');

/**
 * Compile SASS to CSS
 */
gulp.task('styles', ['clean:styles'], function(done) {
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

/**
 * Create $templateCache from the html templates
 */
gulp.task('templatecache', ['clean:code'], function() {

    return gulp
        .src(config.htmlTemplates)
        .pipe($.minifyHtml({empty: true}))
        .pipe($.angularTemplatecache(
            config.templateCache.file,
            config.templateCache.options
        ))
        .pipe(gulp.dest(config.temp));
});

gulp.task('publish-common-js', ['clean:dist', 'templatecache'], function () {
    return gulp.src([
        config.clientApp + 'core/**/*.js',
        config.clientApp + 'widgets/**/*.js',
        config.temp + '*.js'])
        .pipe($.angularFilesort())
        .pipe($.ngAnnotate({ add: true }))
        .pipe($.concat(config.commonFileName + '.js'))
        .pipe(gulp.dest(config.dist))
        .pipe($.uglify())
        .pipe($.rename({ extname: '.min.js' }))
        .pipe(gulp.dest(config.dist));
});

gulp.task('publish-common-css', ['clean:dist', 'styles'], function () {
    return gulp.src([
        config.temp + '*.css'
    ])
    .pipe($.rename({ basename: config.commonFileName}))
    .pipe(gulp.dest(config.dist))
    .pipe($.csso(config.commonFileName + '.css'))
    .pipe($.rename({ extname: '.min.css' }))
    .pipe(gulp.dest(config.dist));
});

gulp.task('clean:code', function (done) {
    var files = [].concat(
        config.temp + '**/*.js'
    );
    clean(files, done);
});
gulp.task('clean:dist', function(done) {
    var files = [].concat(
        config.dist + '**/*.js',
        config.dist + '**/*.css'
    );
    clean(files, done);
});
gulp.task('clean:styles', function(done) {
    var files = [].concat(
        config.temp + '**/*.css'
    );
    clean(files, done);
});

gulp.task('git-clone-repo', function (cb) {
    var branch = args.branch || 'master';

    $.git.clone(config.bowerRepo,
        {cwd: config.temp, args: '-b ' + branch}, function(err) {
            cb(err);
        });
});

gulp.task('git-commit', function () {
    return gulp.src([
        config.dist + '/*',
        config.bowerFilePath

    ])
        .pipe(gulp.dest(config.temp + config.bowerRepoDir + '/'))
        .pipe($.git.commit('script updated common code', {args: '--allow-empty', cwd: config.temp + config.bowerRepoDir}));

});

gulp.task('git-push', function (cb) {
    var branch = args.branch || 'master';

    $.git.push('origin', branch, {cwd: config.temp + config.bowerRepoDir}, function(err) {
        if (err && err.message.indexOf('fatal: write error: Invalid argument' > -1)) {
            return;
        }
        cb(err);
    });
});

gulp.task('publish-common', function() {
    runSequence(
        ['publish-common-js', 'publish-common-css'],
        'git-clone-repo',
        'git-commit',
        'git-push');
});
gulp.task('publish-common-local', function() {
    runSequence(
        ['publish-common-js', 'publish-common-css']);
});
/**
    When using code sharing with Ionic app, this helps in publish the changes faster to test.
 */
gulp.task('watch-publish-common-local', function () {
    gulp.watch(['src/client/**'], ['publish-common-local']);
});

function clean(path, done) {
    del(path).then(function(pathsDeleted) {
        done();
    });
}