// generated on 2016-05-08 using generator-chrome-extension 0.5.6
import gulp from 'gulp';
import del from 'del';
import wiredep from 'wiredep';
import eslint from 'gulp-eslint-new';
import imagemin from 'gulp-imagemin';
import cleanCss from 'gulp-clean-css';
import sourcemaps from 'gulp-sourcemaps';
import removeLogging from 'gulp-remove-logging';
import htmlmin from 'gulp-htmlmin';
import zip from 'gulp-zip';
import livereload from 'gulp-livereload';
import gulpIf from 'gulp-if';
import useref from 'gulp-useref';
import cache from 'gulp-cache';
import size from 'gulp-size';

function extras(cb) {
  return gulp.src([
    'app/*.*',
    'app/_locales/**',
    'app/scripts/**/*.js',  // Ensure JS files are copied
    'app/vendor/scripts/**/*',  // Copy jQuery and moment.js
    '!app/*.json',
    '!app/*.html',
  ], {
    base: 'app',
    dot: true
  }).pipe(gulp.dest('dist'));
}

export function lint(cb) {
  return gulp.src('app/scripts/**/*.js')
    .pipe(eslint()) // No need to pass config, it will use eslint.config.mjs
    .pipe(eslint.format());
}

export function images(cb) {
  return gulp.src('app/images/**/*')
    .pipe(gulpIf(imagemin.isFile, cache(imagemin({
      progressive: true,
      interlaced: true,
      // don't remove IDs from SVGs, they are often used
      // as hooks for embedding and styling
      svgoPlugins: [{cleanupIDs: false}]
    }))
    .on('error', function (err) {
      console.log(err);
      this.end();
    })))
    .pipe(gulp.dest('dist/images'));
}

function html(cb) {
  return gulp.src('app/*.html')
    .pipe(useref({ searchPath: ['.tmp', 'app', '.'] }))
    .pipe(sourcemaps.init())
    .pipe(gulpIf(/^((?!(\.min)).)*\.js$/, removeLogging({ methods: ['log'] })))
    .pipe(gulpIf(/^((?!(\.min)).)*\.js$/, htmlmin({ removeComments: true, collapseWhitespace: true })))
    .pipe(gulpIf('*.css', cleanCss({ compatibility: '*' })))
    .pipe(sourcemaps.write())
    .pipe(gulp.dest('dist'));
}

/*
function chromeManifest(cb) {
  var cwd = process.cwd();
  return $.merge(gulp.src('app/manifest.json')
    .pipe($.chromeManifest({
      buildnumber: false,
      background: {
        target: 'scripts/background.js',
        exclude: [
          'scripts/chromereload.js'
        ]
      }
  })), gulp.src('app/scripts/options.js', {base:'app/'}))
  .pipe($.if('*.css', cleanCss({compatibility: '*'})))
  .pipe($.if(/^((?!(\.min)).)*\.js$/, $.removeLogging({methods:['log']})))
  .pipe($.if(/^((?!(\.min)).)*\.js$/, sourcemaps.init()))
  .pipe($.if(/^((?!(\.min)).)*\.js$/, $.uglify()))
  .pipe($.if(/^((?!(\.min)).)*\.js$/, sourcemaps.write('.')))
  .pipe(gulp.dest('dist', {cwd: cwd}));
}
*/

export function clean(cb) {
  del(['.tmp', 'dist']);
  cb();
}

function watchFiles() {
  livereload.listen();
  gulp.watch('app/scripts/**/*.js', lint);
  gulp.watch([
    'app/*.html',
    'app/scripts/**/*.js',
    'app/images/**/*',
    'app/styles/**/*',
    'app/_locales/**/*.json'
  ], livereload.reload);
  // gulp.watch('bower.json', wiredepInit); // Deprecated now...
}
export const watch = gulp.series(lint, html, watchFiles);

function sizeTask() {
  return gulp.src('dist/**/*').pipe(size({title: 'build', gzip: true}));
}

function wiredepInit(cb) {
  gulp.src('app/*.html')
    .pipe(wiredep({
      ignorePath: /^(\.\.\/)*\.\./
    }))
    .pipe(gulp.dest('app'));
  cb();
}

export function dist() {
  var manifest = require('./dist/manifest.json');
  return gulp.src('dist/**')
      .pipe(zip('PT-' + manifest.version + '.zip'))
      .pipe(gulp.dest('dist'));
}

export const build = gulp.series(
    lint,
    /*chromeManifest,*/
    gulp.parallel(html, images, extras),
    sizeTask
  );
export default gulp.series(clean, build);
