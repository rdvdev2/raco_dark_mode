'use strict';

const gulp = require('gulp');
const sass = require('gulp-sass')(require('sass'));
const fs = require('fs');
const nunjucks = require('gulp-nunjucks');
const rename = require('gulp-rename');
const del = require('del');

function buildStyles() {
  return gulp.src('./src/**/*.scss')
    .pipe(sass.sync({includePaths: ['src/utils'], charset: false}).on('error', sass.logError))
    .pipe(gulp.dest('.'));
}

function buildUserStyles() {
  return gulp.src('./templates/main.user.css.njk')
    .pipe(nunjucks.compile({
      'main_css': fs.readFileSync('./main.css').toString()
    }))
    .pipe(rename('main.user.css'))
    .pipe(gulp.dest("."));
}

gulp.task('clean', function(cb) {
  return del(['main.css', 'main.user.css'], cb);
})

exports.buildStyles = buildStyles;
exports.buildUserStyles = buildUserStyles;
exports.watch = function() {
  gulp.watch(['./src/**/*.scss', 'templates/main.user.css.njk'], exports.default);
}
exports.default = gulp.series(buildStyles, buildUserStyles);