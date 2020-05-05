const gulp = require('gulp'),
  watch = require('gulp-watch'),
  rename = require("gulp-rename"),
  browserSync = require('browser-sync').create(),
  plumber = require('gulp-plumber'),
  rigger = require('gulp-rigger'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cleanCSS = require('gulp-clean-css'),
  babel = require('gulp-babel'),
  concat = require('gulp-concat'),
  uglify = require('gulp-uglify'),
  imagemin = require('gulp-imagemin'),
  clean = require('gulp-clean')

  const path = {
    src: {
      html: 'src/templates/**/*.html',
      scss: 'src/scss/**/app.scss',
      js: 'src/js/**/app.js',
      img: 'src/images/**/*',
      fonts: 'src/fonts/**/*'
    },
    dist: {
      html: 'dist/',
      css: 'dist/css/',
      js: 'dist/js/',
      img: 'dist/images/',
      fonts: 'dist/fonts/'
    },
    watch: {
      html: 'src/templates/**/*.html',
      scss: 'src/scss/**/app.scss',
      js: 'src/js/**/app.js',
      img: 'src/images/**/*',
      fonts: 'src/fonts/**/*'
    }
  }

function html () {
  return gulp.src(path.src.html)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(gulp.dest(path.dist.html))
    .pipe(browserSync.reload({ stream: true }))
}

function scss () {
  return gulp.src(path.src.scss)
    .pipe(plumber())
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer({
      overrideBrowserslist:  ['last 2 versions'],
      cascade: false
    }))
    .pipe(cleanCSS())
    .pipe(rename('app.min.css'))
    .pipe(gulp.dest(path.dist.css))
    .pipe(browserSync.reload({ stream: true }))
}

function js () {
  return gulp.src(path.src.js)
    .pipe(plumber())
    .pipe(rigger())
    .pipe(babel())
    .pipe(uglify())
    .pipe(rename('app.min.js'))
    .pipe(gulp.dest(path.dist.js))
    .pipe(browserSync.reload({ stream: true }))
}

function img () {
  return gulp.src(path.src.img)
    .pipe(imagemin())
    .pipe(gulp.dest(path.dist.img))
    .pipe(browserSync.reload({ stream: true }))
}

function fonts () {
  return gulp.src(path.src.fonts)
    .pipe(gulp.dest(path.dist.fonts))
    .pipe(browserSync.reload({ stream: true }))
}

function serve () {
  browserSync.init({
    server: {
      baseDir: 'dist/',
      index: 'main.html'
    }
  })
}

function watchFiles () {
  gulp.watch(path.watch.html, gulp.series(html))
  gulp.watch(path.watch.scss, gulp.series(scss))
  gulp.watch(path.watch.js, gulp.series(js))
  gulp.watch(path.watch.img, gulp.series(img))
  gulp.watch(path.watch.fonts, gulp.series(fonts))
}

gulp.task('clean', () => {
  gulp.src('dist/', { read: false })
    .pipe(clean())
})

gulp.task('dev', gulp.series([ html, scss, js, img, fonts ], gulp.parallel(serve, watchFiles)))
