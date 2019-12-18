const rename = require('gulp-rename');
const { series } = require('gulp');
const gulp = require('gulp');
const del = require('del');
const uglify = require('gulp-uglify');
const pipeline = require('readable-stream').pipeline;
const concat = require('gulp-concat');

function clean() {
  return del(['./dist/*']);
}

function webToDist() {
  return gulp.src('./src/customSelectWeb.js').pipe(gulp.dest('./dist/'));
}

function minifyWebToDist() {
  return pipeline(
    gulp.src('./src/customSelectWeb.js'),
    rename({ suffix: '.min' }),
    uglify(),
    gulp.dest('dist')
  );
}

function makeModuleVersion() {
  return pipeline(
    gulp.src(['./src/customSelectWeb.js', './src/moduleAppendix.js']),
    concat('customSelect.js'),
    gulp.dest('dist')
  );
}

exports.default = series(clean, webToDist, minifyWebToDist, makeModuleVersion);
