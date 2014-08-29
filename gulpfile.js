var gulp = require('gulp');
var connect = require('gulp-connect');
var ghpages = require('gulp-gh-pages');

gulp.task('serve', function() {
  connect.server({
    root: 'www',
    livereload: true
  });
});

gulp.task('html', function() {
  gulp.src('www/**/*.html').
    pipe(connect.reload());
});

gulp.task('css', function() {
  gulp.src('www/**/*.css').
    pipe(connect.reload());
});

gulp.task('js', function() {
  gulp.src(['!www/third_party/**/*.js', 'www/**/*.js']).
    pipe(connect.reload());
});

gulp.task('watch', function() {
  gulp.watch(['!www/third_party/**/*.html', 'www/**/*.html'], ['html']);
  gulp.watch(['!www/third_party/**/*.css', 'www/**/*.css'], ['css']);
  gulp.watch(['!www/third_party/**/*.js', 'www/**/*.js'], ['js']);
});

gulp.task('open', function(done) {
  var url = 'http://localhost:8080';
  var spawn = require('child_process').spawn;
  switch (require('os').platform()) {
  case 'darwin': spawn('open', [url], callback); break;
  case 'win32': spawn('cmd', ['/c', 'start', url], callback); break;
  default: process.stdout.write('open ' + url + ' to view presentation.');
  }
  function callback(error, stdout, stderr) {
    if (error) process.stdout.write('error: ' + error);
  }
});

gulp.task('deploy', function() {
  return gulp.src('www/**/*').
    pipe(ghpages());
});

gulp.task('default', ['serve', 'watch', 'open']);
