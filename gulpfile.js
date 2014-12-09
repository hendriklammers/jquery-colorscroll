'use strict';

var gulp = require('gulp'),
    jshint = require('gulp-jshint'),
    rename = require('gulp-rename'),
    uglify = require('gulp-uglify'),
    del = require('del');

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

gulp.task('watch', function() {
    gulp.watch('src/*.js', ['jshint']);
});

gulp.task('clean', function() {
    del('dist');
});

gulp.task('build', ['clean', 'jshint', 'minify'], function() {
    // Nothing here...
});
