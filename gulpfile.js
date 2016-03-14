var gulp = require('gulp');
var jsdoc = require('gulp-jsdoc3');
var mocha = require('gulp-mocha');


gulp.task('test', function() {
  return gulp.src('./test/test.js', {read: false})
  // gulp-mocha needs filepaths so you can't have any plugins before it
  .pipe(mocha());
});

gulp.task('docs', function(cb) {
  var config = require('./jsdoc.json');
  gulp.src(['README.md', 'package.json', './lib/*.js'], {read: false})
    .pipe(jsdoc(config, cb));
});
