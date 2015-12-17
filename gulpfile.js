/*
*  Gulpfile that will read the node.yml and start provision the raspberry pi
*/

var gulp            = require('gulp');
var gutil           = require('gulp-util');
var gyaml           = require('gulp-yaml');
var git             = require('gulp-git');
var shell           = require('gulp-shell');
var del             = require('del');
var yaml            = require('js-yaml');
var fs              = require('fs');

var nodeinfo = { };

// This is the default task, this will run when the node boots up
gulp.task('default', ['config', 'start']);

gulp.task('config', function() {
    nodeinfo = yaml.safeLoad(fs.readFileSync('./node.yml', 'utf8'));
});

gulp.task('yml2json', function() {
    gutil.log('reading node.yml');
    gulp.src('./*.yml')
    .pipe(gyaml({ space: 4 }))
    .pipe(gulp.dest('./app'));
    gutil.log('node.yml parsed into node.json');
});

gulp.task('clone', ['yml2json'], function(callback) {

    //  We are cloning the product into the
    git.clone(nodeinfo.package.source, {args: './app'},  function(err) {
        if (err) throw err;
        callback();
    });
});

gulp.task('clean', function() {
    return del(['./app']);
});

gulp.task('provision', ['clone'], function() {
    return gulp.src('')
        .pipe(shell(nodeinfo.provision, {cwd: './app'}));
});

gulp.task('start', ['provision', 'beforestart'], function() {
    return gulp.src('')
        .pipe(shell(nodeinfo.package.start, {cwd: './app'}));
});

gulp.task('beforestart', ['provision'], function() {
    return gulp.src('')
        .pipe(shell(nodeinfo.package.beforestart, {cwd: './app'}));
});
