var gulp = require('gulp'),
    browserify = require('gulp-browserify'),
    webserver = require('gulp-webserver'),
    sass = require('gulp-sass');

var src = './src',
    app = './build/app';

gulp.task('js', function() {
  return gulp.src(src + '/js/**/*.js' )
    .pipe(browserify({
      transform: 'reactify',
      debug: true
    }))
    .on('error', function (err) {
      console.error('Error!', err.message);
    })
    .pipe(gulp.dest(app + '/js'));
});

gulp.task('html', function() {
  gulp.src(app + '/**/*.html');
});

gulp.task('css', function() {
  return gulp.src(src + '/scss/**/*.scss')
      .pipe(sass().on('error', sass.logError))
      .pipe(gulp.dest(app + '/css/'));
});

gulp.task('watch', function() {
  gulp.watch(src + '/js/**/*.js', ['js']);
  gulp.watch(src + '/scss/**/*.scss', ['css']);
  gulp.watch([app + '/**/*.html'], ['html']);
});

gulp.task('webserver', function() {
  gulp.src(app + '/')
    .pipe(webserver({
        livereload: true,
        open: true
    }));
});

gulp.task('default', ['watch', 'html', 'js', 'css', 'webserver']);
