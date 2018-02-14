const gulp = require('esds-build'),
      javascriptObfuscator = require('gulp-javascript-obfuscator'),
      rename = require('gulp-rename'),
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

gulp.task('obfuscate', gulp.series('compress-brickulator-script', 'watch:brickulator:script'));


