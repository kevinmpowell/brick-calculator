const gulp = require('esds-build'),
      javascriptObfuscator = require('gulp-javascript-obfuscator'),
      rename = require('gulp-rename'),
      cleanCSS = require('gulp-clean-css'),
      fs = require('fs'),
      { exec } = require('child_process');
       
gulp.task('compress-brickulator-script', function () {
  if (fs.existsSync('docs/scripts/brickulator.js')) {
    return gulp.src('docs/scripts/brickulator.js')
        .pipe(javascriptObfuscator({
          compact: true,
          controlFlowFlattening: false,
          deadCodeInjection: false,
          debugProtection: false,
          debugProtectionInterval: false,
          disableConsoleOutput: true,
          identifierNamesGenerator: 'hexadecimal',
          log: false,
          renameGlobals: false,
          rotateStringArray: false,
          selfDefending: false,
          stringArray: false,
          stringArrayEncoding: false,
          stringArrayThreshold: 0.75,
          unicodeEscapeSequence: false
        }))
        .pipe(rename('brickulator.min.js'))
        .pipe(gulp.dest('docs/scripts'));
  } else {
    return false;
  }
});

gulp.task('watch:brickulator:script', function(){
    return gulp.watch(['docs/scripts/brickulator.js'], gulp.series('compress-brickulator-script'));
});

gulp.task('obfuscate-scripts', gulp.series('compress-brickulator-script', 'watch:brickulator:script'));


gulp.task('minify-brickulator-styles', function () {
  if (fs.existsSync('docs/styles/brickulator.css')) {
    return gulp.src('docs/styles/brickulator.css')
        .pipe(cleanCSS({}))
        .pipe(rename('brickulator.min.css'))
        .pipe(gulp.dest('docs/styles'));
  } else {
    return false;
  }
});

gulp.task('watch:brickulator:style', function(){
    return gulp.watch(['docs/styles/brickulator.css'], gulp.series('minify-brickulator-styles'));
});

gulp.task('minify-styles', gulp.series('minify-brickulator-styles', 'watch:brickulator:style'));

gulp.task('optimize', gulp.parallel('obfuscate-scripts', 'minify-styles'));



