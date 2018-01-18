const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const less = require('gulp-less');
const runSequence = require('run-sequence');

//const templateData = require('./src/data/context.json');
const templateData = {};

gulp.task('build-html', function() {
  const options = {
    // partials (reusable files - are referenced like {{> header}})
    batch: ['./src/templates/']
  }

  return gulp.src('src/*.html')
    .pipe(handlebars(templateData, options))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-js', function() {
  const srcFiles = [
    'src/js/libs/jquery-3.2.1.js',
    'src/js/libs/jquery-3.2.1.min.js',
    'src/js/libs/*.js',
    'src/js/scripts.js'
  ]
  if(process.env.NODE_ENV !== 'production') {
    srcFiles.push('!src/js/libs/*.min.js')
  }
  return gulp.src(srcFiles)
    .pipe(concat('bundle.js'))
    .pipe(gulpif(process.env.NODE_ENV === 'production', uglify()))
    .pipe(gulp.dest('dist'))
});

gulp.task('compile-less', function() {
  return gulp.src('src/css/styles.less')
      .pipe(less())
      .pipe(gulp.dest('src/css'));
});

gulp.task('build-css', ['compile-less'], function() {
  const srcFiles = [
    'src/css/libs/bootstrap.min.css',
    'src/css/libs/*.css',
    'src/css/styles.css',
  ]
  if(process.env.NODE_ENV !== 'production') {
    srcFiles.push('!src/css/*.min.css')
  }
  return gulp.src(srcFiles)
    .pipe(concat('bundle.css'))
    .pipe(gulpif(process.env.NODE_ENV === 'production', uglify()))
    .pipe(gulp.dest('dist'))
});

gulp.task('build-assets', function() {
  gulp.src('src/assets/**/*')
    .pipe(gulp.dest('dist/assets/'));

  gulp.src('src/fonts/**/*')
    .pipe(gulp.dest('dist/fonts/'));
});

gulp.task('watch', function() {
  runSequence(['build-html', 'build-js', 'build-css', 'build-assets']);
  watch(['src/*.html', 'src/templates/*.hbs'], function() {
    runSequence('build-html');
  });
  watch('src/js/*.js', function() {
    runSequence('build-js');
  });
  watch(['src/css/libs/*.css', 'src/css/*.less'], function() {
    runSequence('build-css');
  });
  watch('src/assets/**/*', function() {
    runSequence('build-assets');
  });
});
