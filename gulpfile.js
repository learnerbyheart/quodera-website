const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const cleanCSS = require('gulp-clean-css');
const gulpif = require('gulp-if');
const less = require('gulp-less');
const pump = require('pump');
const rename = require("gulp-rename");
const autoprefixer = require('gulp-autoprefixer');
const runSequence = require('run-sequence');
const sitemap = require('gulp-sitemap');

const templateData = require('./src/data/context.json');

gulp.task('build-html', function() {
  const options = {
    // partials (reusable files - are referenced like {{> header}})
    batch: ['./src/templates/', './src/templates/icons/']
  }

  return gulp.src('src/*.html')
    .pipe(handlebars(templateData, options))
    .pipe(gulp.dest('dist'))
    .pipe(sitemap({
      siteUrl: process.env.URL || 'http://quodera.com'
    }))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build-js', function(cb) {
  const srcFiles = [
    'src/js/libs/jquery-3.2.1.js',
    'src/js/libs/*.js',
    'src/js/scripts.js'
  ]
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
  pump([
    gulp.src(srcFiles),
    concat('bundle.css'),
    gulpif(process.env.NODE_ENV === 'production', cleanCSS()),
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

  // copy svg icons into handlebars templates so that they can be imported
  pump([
    gulp.src('src/icons/**/*.svg'),
    rename({
      prefix: 'icon-',
      extname: ".hbs"
    }),
    gulp.dest('src/templates/icons/')
  ]);
});

gulp.task('watch', function() {
  runSequence(['build-html', 'build-js', 'build-css', 'build-assets']);
  watch(['src/*.html', 'src/templates/**/*.hbs'], function() {
    runSequence('build-html');
  });
  watch('src/js/*.js', function() {
    runSequence('build-js');
  });
  watch(['src/css/libs/*.css', 'src/css/*.less'], function() {
    runSequence('build-css');
  });
  watch(['src/assets/**/*', 'src/icons/**/*'], function() {
    runSequence('build-assets');
  });
});

gulp.task('build', ['build-html', 'build-js', 'build-css', 'build-assets']);
