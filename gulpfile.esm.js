import gulp from 'gulp';
import data from 'gulp-data';

import dartSass from 'sass';
import gulpSass from 'gulp-sass';
const sass = gulpSass(dartSass);

import nunjucks from 'gulp-nunjucks';
import rename from 'gulp-rename';

import fs from 'fs';
import del from 'del';

const packageFile = './package.json';
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
    .pipe(data(getUserStylesData))
    .pipe(nunjucks.compile({}, {autoescape: false}))
    .pipe(rename(userCssOutput))
    .pipe(gulp.dest("."));
}

function getUserStylesData() {
  const packageJson = JSON.parse(fs.readFileSync(packageFile));
  const mainCss = fs.readFileSync(cssOutput).toString();

  return {
    'name': packageJson.userCss.name,
    'namespace': packageJson.userCss.namespace,
    'version': packageJson.version,
    'description': packageJson.description,
    'author': packageJson.author,
    'license': packageJson.license,
    'domain': packageJson.userCss.domain,
    'main_css': mainCss,
  };
}

export function clean() {
  return del([cssOutput, userCssOutput]);
}

export function watch() {
  gulp.watch([scssSources, templateSource], exports.default);
}

export default gulp.series(buildStyles, buildUserStyles);