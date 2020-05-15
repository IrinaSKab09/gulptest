var gulp = require('gulp'),
    clean = require('gulp-clean'),
    imagemin = require('gulp-imagemin'),
    svgmin = require('gulp-svgmin'),
    concat = require('gulp-concat'),
    cssnano = require('gulp-cssnano'),
    autoprefixer = require('gulp-autoprefixer'),
    uglify = require('gulp-uglify'),
    pug = require('gulp-pug'),
    browserSync = require('browser-sync').create(),
    less = require('gulp-less');


gulp.task('scripts', function () {
    gulp.src('js/*.js')
        .pipe(concat('app.js'))
        .pipe(uglify())
        .pipe(gulp.dest('build'));
});

gulp.task('images', function () {
  gulp.src('img/*')
      .pipe(imagemin())
      .pipe(gulp.dest('build/img'));
});

gulp.task('svg', function () {
    gulp.src('icons/*')
        .pipe(svgmin())
        .pipe(gulp.dest('build/icons'));
  });

gulp.task('clean', function () {
    return gulp.src('build/', {read: false, allowEmpty: true})
      .pipe(clean());
  });

gulp.task('browser-sync', function() {
    return browserSync.init({
        server: {
            baseDir: './build/'
        },
        port: 3000,
        host: 'localhost',
        logPrefix: 'frontend',
        open: true
    });
});

gulp.task('watch', function() {
    gulp.watch('js/*.js', gulp.series('scripts'));
    gulp.watch('./less/*.less', gulp.series('less'));
    gulp.watch('./templates/**/*.pug', gulp.series('templates'));
    gulp.watch('img/*.jpg', gulp.series('images'));
    gulp.watch('icons/*.svg', gulp.series('svg'));
});

gulp.task('templates', function buildHTML() {
    return gulp.src('./templates/pages/*.pug')
        .pipe(pug({
            pretty: true
        }).on('error', function(error) {
            console.log(error);
        }))
        .pipe(gulp.dest('build'));
});

gulp.task('less', function () {
    return gulp.src('./less/*.less')
        .pipe(less())
        .pipe(autoprefixer())
        .pipe(concat('styles.css'))
        .pipe(cssnano())
        .pipe(gulp.dest('./build/css'));
  });

gulp.task('default', gulp.series('clean', gulp.parallel('scripts', 'images', 'svg', 'less', 'templates', 'browser-sync', 'watch')));