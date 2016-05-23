var gulp = require('gulp');
var ts = require('gulp-typescript');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var sourcemaps = require('gulp-sourcemaps');

// The order is important! 'app.ts' must be in the end!
var targets = ['./models/*.ts' , './services/*.ts','./controllers/*.ts','../../typings/browser.d.ts', './calendar.ts'];
var outFile = 'calendar.js';
var outFileMin = 'calendar.min.js';
var outDir = 'build';
var tsConfig = {
target: 'es5',
};

// Use function if arrow syntax is not supported!
gulp.task('build', () => {
    return gulp.src(targets)
        .pipe(sourcemaps.init()) // Source maps needs to be initialized
        .pipe(ts(tsConfig)) // TS compile
        .pipe(concat(outFile)) // Concatenation to a single file
        .pipe(sourcemaps.write()) // Adding source maps
        .pipe(gulp.dest(outDir)) // Saving
        .pipe(uglify()) // Now uglifying -- this removes the sourcemaps too
        .pipe(concat(outFileMin)) // No concat, just renaming
        .pipe(gulp.dest(outDir)); // Saving minified version too
});
