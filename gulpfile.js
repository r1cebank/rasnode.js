/*
*  Gulpfile that will read the node.yml and start provision the raspberry pi
*/

var gulp            = require('gulp');
var gutil           = require('gulp-util');
var unzip           = require('gulp-unzip');
var remoteSrc       = require('gulp-remote-src');
var decompress      = require('gulp-decompress');
var gyaml           = require('gulp-yaml');
var git             = require('gulp-git');
var shell           = require('gulp-shell');
var del             = require('del');
var yaml            = require('js-yaml');
var fs              = require('fs');
var path            = require('path');

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
    if(nodeinfo.package.type == 'git') {
        git.clone(nodeinfo.package.source, {args: './app'},  function(err) {
            if (err) throw err;
            callback();
        });
    } else if(nodeinfo.package.type == 'local') {
        gulp.src(nodeinfo.package.source)
        .pipe(gulp.dest('./app'))
        .on('end', callback);
    } else if(nodeinfo.package.type == 'remotezip') {
        remoteSrc(nodeinfo.package.source.files, {
            base: nodeinfo.package.source.base
        })
        .pipe(unzip())
        .pipe(gulp.dest('./app'))
        .on('end', callback);
    } else if(nodeinfo.package.type == 'remotefiles') {
        remoteSrc(nodeinfo.package.source.files, {
            base: nodeinfo.package.source.base
        })
        .pipe(gulp.dest('./app'))
        .on('end', callback);
    }
});

gulp.task('clean', function() {
    return del(['./app']);
});

gulp.task('provision', ['clone'], function() {
    if(nodeinfo.provision) {
        return gulp.src('')
            .pipe(shell(nodeinfo.provision, {cwd: './app'}));
    }
});

gulp.task('start', ['provision', 'beforestart'], function() {
    if(nodeinfo.package.start) {
        return gulp.src('')
            .pipe(shell(nodeinfo.package.start, {cwd: path.join('./app', nodeinfo.package.workingdir || '')}));
    }
});

gulp.task('beforestart', ['provision'], function() {
    if(nodeinfo.package.beforestart) {
        return gulp.src('')
            .pipe(shell(nodeinfo.package.beforestart, {cwd: path.join('./app', nodeinfo.package.workingdir || '')}));
    }
});
