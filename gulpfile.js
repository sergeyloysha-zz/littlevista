var os = require('os');
var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyhtml = require('gulp-minify-html');
var jade = require('gulp-jade');
var less = require('gulp-less');
var stylus = require('gulp-stylus');
var minifycss = require('gulp-minify-css');
var autoprefixer = require('autoprefixer-stylus');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var watch = require('gulp-watch');
var connect = require('gulp-connect');
var open = require('gulp-open');
var ghPages = require('gulp-gh-pages');

var buildDir = 'build';

var appScripts = [
  'assets/js/**'
];

var appStyles = [
  'assets/styles/**'
];
var appImages = [
  'assets/images/**'
];
var appFonts = [
  'assets/fonts/**'
];

// Vendor Files
var vendorScripts = [
  'bower_components/jquery/dist/jquery.min.js'
];

var vendorStyles = [
  'bower_components/normalize-css/normalize.css'
];

var vendorFonts = [

];

var browser = os.platform() === 'linux' ? 'google-chrome' : (
  os.platform() === 'darwin' ? 'google chrome' : (
  os.platform() === 'win32' ? 'chrome' : 'firefox'));

// Start the server
gulp.task('server', function() {

  var opts = {
    root: buildDir,
    port: 2000,
    host: '127.0.0.1',
    livereload: true
  }

  connect.server(opts);

  gulp.src(__filename)
    .pipe(open({
      uri: 'http://' + opts.host + ':' + opts.port,
      app: browser
    }));
});

// Vendor
gulp.task('vendors', function() {
  gulp.src(vendorScripts)
    .pipe(concat('vendor.js'))
    .pipe(gulp.dest(buildDir + '/assets/js'))
  gulp.src(vendorStyles)
    .pipe(concat('vendor.css'))
    .pipe(gulp.dest(buildDir + '/assets/styles'))
  gulp.src(vendorFonts)
    .pipe(gulp.dest(buildDir + '/assets/fonts'))
});

// Scripts
gulp.task('scripts', function () {
	gulp.src(appScripts)
		.pipe(concat('app.js'))
		.pipe(gulp.dest(buildDir + '/assets/js'))
})
// Views
gulp.task('views', function() {

  var opts = {
    quotes: true,
    pretty: true
  };

  gulp.src('*.jade')
    .pipe(jade(opts))
    .pipe(gulp.dest(buildDir));

});

// Styles
gulp.task('styles', function() {

  var opts = {
    use: [autoprefixer({ browsers: ['last 2 versions'] })],
    //compress: true
  }

  return gulp.src('assets/styles/app.styl')
    .pipe(stylus(opts))
    .pipe(gulp.dest(buildDir + '/assets/styles/'));

});

// Images
gulp.task('images', function() {
  gulp.src(appImages)
    .pipe(imagemin({
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    }))
    .pipe(gulp.dest(buildDir + '/assets/images/'))
});

// Fonts
gulp.task('fonts', function() {
  gulp.src(appFonts)
    .pipe(gulp.dest(buildDir + '/assets/fonts/'))
});

// Default task
gulp.task('default', function() {
  gulp.start('scripts', 'vendors', 'views', 'styles', 'images', 'fonts');
});

// Deploy gh-pages branch task
gulp.task('deploy', function() {
  return gulp.src('./' + buildDir + '/**/*')
    .pipe(ghPages());
});

// Watch
gulp.task('watch', ['default', 'server'], function() {

  // Watch app style, JS and image files
  gulp.watch(appScripts, ['scripts']);
  gulp.watch(appStyles, ['styles']);
  gulp.watch(appImages, ['images']);

  // Watch HTML files
  gulp.watch(['*.jade'], ['views']);

  // Watch any files in build/, reload on change
  watch(buildDir + '/**').pipe(connect.reload());

});