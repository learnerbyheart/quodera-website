const gulp = require('gulp');
const handlebars = require('gulp-compile-handlebars');
const watch = require('gulp-watch');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const gulpif = require('gulp-if');
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

gulp.task('build-js', function() {
  const srcFiles = [
    'src/js/libs/jquery-1.11.1.js',
    'src/js/libs/jquery-1.11.1.min.js',
    'src/js/libs/bootstrap.min.js',
    'src/js/libs/*.js',
    'src/js/script.js'
  ]
  if(process.env.NODE_ENV !== 'production') {
    srcFiles.push('!src/js/*.min.js')
  }
  return gulp.src(srcFiles)
    .pipe(concat('bundle.js'))
    .pipe(gulpif(process.env.NODE_ENV === 'production', uglify()))
    .pipe(gulp.dest('dist'))
});

gulp.task('build-css', function() {
  const srcFiles = [
    'src/css/libs/bootstrap.min.css',
    'src/css/libs/*.css',
    'src/css/style.css',
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
  watch('src/*.html', function() {
    runSequence('build-html');
  });
  watch('src/js/*.js', function() {
    runSequence('build-js');
  });
  watch('src/css/*.css', function() {
    runSequence('build-css');
  });
  watch('src/assets/**/*', function() {
    runSequence('build-assets');
  });
});
