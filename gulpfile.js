/*
*  Gulpfile that will read the node.yml and start provision the raspberry pi
*/

var gulp            = require('gulp');
var gutil           = require('gulp-util');
var gyaml           = require('gulp-yaml');
var yaml            = require('js-yaml');
var git             = require('gulp-git');
var fs              = require('fs');

var nodeinfo = { };

// This is the default task, this will run when the node boots up
gulp.task('default', ['config', 'run']);

gulp.task('config', ['yml2json'], function() {
    nodeinfo = yaml.safeLoad(fs.readFileSync('./node.yml', 'utf8'));
});

gulp.task('yml2json', function() {
    gutil.log('reading node.yml');
    gulp.src('./*.yml')
    .pipe(gyaml({ space: 4 }))
    .pipe(gulp.dest('./'));
    gutil.log('node.yml parsed into node.json');
});

gulp.task('clone', ['config'], function(callback) {
    git.clone(nodeinfo.package.source, function(err) {
        if (err) throw err;
        callback();
    });
});

gulp.task('install', ['clone'], function() {
});

gulp.task('run', ['install'], function() {
});
