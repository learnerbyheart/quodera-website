const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
const less = require('gulp-less');
const pump = require('pump');
const autoprefixer = require('gulp-autoprefixer');
const runSequence = require('run-sequence');

const templateData = require('./src/data/context.json');

gulp.task('build-html', function() {
  const options = {
    // partials (reusable files - are referenced like {{> header}})
    batch: ['./src/templates/']
  }

  return gulp.src('src/*.html')
    .pipe(handlebars(templateData, options))
    .pipe(gulp.dest('dist'));
});

gulp.task('build-js', function(cb) {
  const srcFiles = [
    'src/js/libs/jquery-3.2.1.js',
    'src/js/libs/jquery-3.2.1.min.js',
    'src/js/libs/*.js',
    'src/js/scripts.js'
  ]
  if(process.env.NODE_ENV !== 'production') {
    srcFiles.push('!src/js/libs/*.min.js')
  }
  pump([
    gulp.src(srcFiles),
    concat('bundle.js'),
    gulpif(process.env.NODE_ENV === 'production', uglify()),
    gulp.dest('dist')
  ], cb);
});

gulp.task('compile-less', function(cb) {
  pump([
    gulp.src('src/css/styles.less'),
    less(),
    autoprefixer(),
    gulp.dest('src/css')
  ], cb);
});

gulp.task('build-css', ['compile-less'], function(cb) {
  const srcFiles = [
    'src/css/libs/bootstrap.min.css',
    'src/css/libs/*.css',
    'src/css/styles.css',
  ]
  if(process.env.NODE_ENV !== 'production') {
    srcFiles.push('!src/css/*.min.css')
  }
  pump([
    gulp.src(srcFiles),
    concat('bundle.css'),
    gulpif(process.env.NODE_ENV === 'production', uglify()),
    gulp.dest('dist')
  ], cb);
});

gulp.task('build-assets', function(cb) {
  pump([
    gulp.src('src/assets/**/*'),
    gulp.dest('dist/assets/')
  ]);

  pump([
    gulp.src('src/fonts/**/*'),
    gulp.dest('dist/fonts/')
  ]);
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
