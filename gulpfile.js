'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const del = require('del');

function buildStyles() {
  return gulp.src('./src/**/*.scss')
    .pipe(sass.sync({includePaths: ['src/utils'], charset: false}).on('error', sass.logError))
    .pipe(gulp.dest('.'));
}

gulp.task('clean', function(cb) {
  return del(['main.user.css'], cb);
})

exports.buildStyles = buildStyles;
exports.watch = function() {
  gulp.watch('./src/**/*.scss', buildStyles);
}
exports.default = gulp.series(buildStyles);