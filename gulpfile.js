'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    browserSync = require('browser-sync'),
    del = require('del');

gulp.task('browser-sync', function() {
    browserSync.init({
        files: [
            'index.html',
            'src/**/*.js'
        ],
        server: {
            baseDir: ['./']
        },
        notify: true
    });
});

gulp.task('jshint', function() {
    return gulp.src('src/*.js')
        .pipe(jshint('.jshintrc'))
        .pipe(jshint.reporter('jshint-stylish'));
});

gulp.task('minify', function() {
    return gulp.src('src/*.js')
        .pipe(gulp.dest('dist'))
        .pipe(uglify())
        .pipe(rename({suffix: '.min'}))
        .pipe(gulp.dest('dist'));
});

gulp.task('clean', function() {
    del('dist');
});

gulp.task('watch', ['browser-sync'], function() {
    gulp.watch('src/*.js', ['jshint']);
});

gulp.task('build', ['clean', 'jshint', 'minify'], function() {
    // Nothing here...
});
