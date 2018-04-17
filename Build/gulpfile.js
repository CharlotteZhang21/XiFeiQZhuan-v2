const gulp = require('gulp');
const concat = require('gulp-concat');
const uglify = require('gulp-uglify');
const uglifycss = require('gulp-uglifycss');
const htmlReplace = require('gulp-html-replace');
const browserSync = require('browser-sync').create();
const gulpIf = require('gulp-if');
const argv = require('yargs').argv;
const sourceMaps = require('gulp-sourcemaps');
const jsBase64 = require('gulp-js-base64-inject');
const babel = require('gulp-babel');
const cached = require('gulp-cached');
const remember = require('gulp-remember');
const cssBase64 = require('gulp-base64');
const s3 = require('gulp-s3');
const rename = require('gulp-rename');
const replace = require('gulp-replace');
const order = require('gulp-order');
const clean = require('gulp-clean');

const networks = {
  mraid() {
    return replace('<head>', '<head><script type="text/javascript" src="mraid.js"></script>');
  },
};

gulp.task('body-js', () => {
  const wrapper = argv.wrapper ? argv.wrapper : 'default';

  return gulp.src([
    'src/**/*.js',
    `!src/js/wrapper-!(${wrapper})*.js`,
  ]).pipe(order([
    'game/js/vendor/*.js',
    'game/js/*.js',
    'js/wrapper-*.js',
    '**/*',
  ]))
    .pipe(gulpIf(!argv.prod, sourceMaps.init()))
    .pipe(cached('babel-body'))
    .pipe(babel())
    .pipe(remember('babel-body'))
    .pipe(concat('body.js'))
    .pipe(jsBase64({
      debug: false,
    }))
    .pipe(gulpIf(argv.prod, uglify()))
    .pipe(gulpIf(!argv.prod, sourceMaps.write('.')))
    .pipe(gulp.dest('./temp/js'));
});

gulp.task('css', () => gulp.src([
  'src/css/*.css',
])
  .pipe(gulpIf(!argv.prod, sourceMaps.init()))
  .pipe(concat('main.css'))
  // Fonts
  .pipe(cssBase64({
    baseDir: 'src/game/fonts',
    extensionsAllowed: ['.ttf', '.otf', '.woff'],
    maxImageSize: 1000 * 1024,
    // Will throw image errors
    debug: false,
  }))
  // Images
  .pipe(cssBase64({
    baseDir: 'src/game/img',
    extensionsAllowed: ['.png', '.jpg', '.jpeg', '.svg'],
    maxImageSize: 1000 * 1024,
    // Will throw font errors
    debug: false,
  }))
  .pipe(gulpIf(argv.prod, uglifycss()))
  .pipe(gulpIf(!argv.prod, sourceMaps.write('.')))
  .pipe(gulp.dest('./temp/css')));

gulp.task('replace-js', ['body-js', 'css'], () => gulp.src('src/*.html')
  .pipe(htmlReplace({
    'body-js': {
      src: gulp.src('temp/js/body.js'),
      tpl: '<script type="text/javascript">%s</script>',
    },
    css: {
      src: gulp.src('temp/css/main.css'),
      tpl: '<style type="text/css">%s</style>',
    },
  }))
  .pipe(gulpIf(argv.mraid, networks.mraid()))
  .pipe(gulp.dest('./dist')));

gulp.task('dev-replace-js', ['body-js', 'css'], () => gulp.src('src/*.html')
  .pipe(htmlReplace({
    'body-js': {
      src: 'body.js',
      tpl: '<script type="text/javascript" src="%s"></script>',
    },
    css: {
      src: 'main.css',
      tpl: '<link rel="stylesheet" href="%s">',
    },
  }))
  .pipe(gulpIf(argv.mraid, networks.mraid()))
  .pipe(gulp.dest('./dist')));

gulp.task('copy', ['replace-js'], () => {
  if (argv.prod) {
    return;
  }

  gulp.src('temp/js/body.js').pipe(gulp.dest('dist'));
  gulp.src('temp/css/main.css').pipe(gulp.dest('dist'));
});

gulp.task('dev-copy', ['dev-replace-js'], () => {
  if (argv.prod) {
    return;
  }

  gulp.src('temp/js/body.js').pipe(gulp.dest('dist'));
  gulp.src('temp/js/body.js.map').pipe(gulp.dest('dist'));

  gulp.src('temp/css/main.css').pipe(gulp.dest('dist'));
  gulp.src('temp/css/main.css.map').pipe(gulp.dest('dist'));
});

gulp.task('watch', () => {
  gulp.watch(['src/js/*.js', 'src/game/js/**/*.js', 'src/template.html', 'src/css/*.css'], ['replace-js', 'reload', 'copy']);
});

gulp.task('dev-watch', () => {
  gulp.watch(['src/js/*.js', 'src/game/js/**/*.js', 'src/template.html', 'src/css/*.css'], ['dev-replace-js', 'dev-reload', 'dev-copy']);
});

const initBrowsersync = function initBrowsersync() {
  browserSync.init({
    open: !argv.noopen,
    browser: argv.browser,
    server: {
      baseDir: './dist',
      index: 'template.html',
    },
    reloadThrottle: argv.reloadThrottle || 0,
  });
};

gulp.task('dev-browsersync', ['dev-copy'], () => {
  initBrowsersync();
});

gulp.task('browsersync', ['copy'], () => {
  initBrowsersync();
});

gulp.task('default', () => {
  if (argv.prod) {
    gulp.start('browsersync');
    gulp.start('watch');

    return;
  }

  gulp.start('dev-browsersync');
  gulp.start('dev-watch');
});

/** Default **/
gulp.task('reload', ['replace-js', 'copy'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('dev-reload', ['dev-replace-js', 'dev-copy'], (done) => {
  browserSync.reload();
  done();
});

gulp.task('upload', () => {
  const AWS = {
    key: process.env.AWS_ACCESS_KEY_ID,
    secret: process.env.AWS_SECRET_ACCESS_KEY,
    bucket: 'playables-dev',
    region: 'eu-west-1',
  };

  const randomString = Math.random().toString(36).substr(2, 10);

  gulp.src('./dist/template.html')
    .pipe(rename((path) => {
      path.basename = randomString;
    }))
    .pipe(s3(AWS))
    .on('end', () => {
      console.log(`https://playables-dev.s3.amazonaws.com/${randomString}.html`);
    });
});

gulp.task('clean', () => {
  return gulp.src(['dist', 'temp'], { read: false }).pipe(clean());
});
