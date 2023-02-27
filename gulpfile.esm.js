import gulp from 'gulp';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

import nunjucks from 'gulp-nunjucks';
import rename from 'gulp-rename';

import fs from 'fs';
import del from 'del';

const scssSources = './src/**/*.scss';
const scssUtilsSources = './src/utils';
const cssOutput = './main.css'
const templateSource = './templates/main.user.css.njk';
const userCssOutput = './main.user.css';

export function buildStyles() {
  return gulp.src(scssSources)
    .pipe(sass.sync({includePaths: [scssUtilsSources], charset: false})
      .on('error', sass.logError))
    .pipe(gulp.dest('.'));
}

export function buildUserStyles() {
  return gulp.src(templateSource)
    .pipe(nunjucks.compile({
      'main_css': fs.readFileSync(cssOutput).toString()
    }))
    .pipe(rename(userCssOutput))
    .pipe(gulp.dest("."));
}

export function clean() {
  return del([cssOutput, userCssOutput]);
}

export function watch() {
  gulp.watch([scssSources, templateSource], exports.default);
}

export default gulp.series(buildStyles, buildUserStyles);