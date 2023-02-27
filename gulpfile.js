'use strict';

const gulp = require('gulp');

const sass = require('gulp-sass')(require('sass'));
const nunjucks = require('gulp-nunjucks');
const rename = require('gulp-rename');

const fs = require('fs');
const del = require('del');

const scssSources = './src/**/*.scss';
const scssUtilsSources = './src/utils';
const cssOutput = './main.css'
const templateSource = './templates/main.user.css.njk';
const userCssOutput = './main.user.css';

function buildStyles() {
  return gulp.src(scssSources)
    .pipe(sass.sync({includePaths: [scssUtilsSources], charset: false})
      .on('error', sass.logError))
    .pipe(gulp.dest('.'));
}

function buildUserStyles() {
  return gulp.src(templateSource)
    .pipe(nunjucks.compile({
      'main_css': fs.readFileSync(cssOutput).toString()
    }))
    .pipe(rename(userCssOutput))
    .pipe(gulp.dest("."));
}

gulp.task('clean', function(cb) {
  return del([cssOutput, userCssOutput], cb);
})

exports.buildStyles = buildStyles;
exports.buildUserStyles = buildUserStyles;
exports.watch = function() {
  gulp.watch([scssSources, templateSource], exports.default);
}
exports.default = gulp.series(buildStyles, buildUserStyles);