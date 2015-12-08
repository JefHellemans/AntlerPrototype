var gulp = require('gulp'),
    csslint = require('gulp-csslint'),
    cssMinifier = require('gulp-minify-css'),
    sourcemaps = require('gulp-sourcemaps'),
    concat = require('gulp-concat'),
    less = require('gulp-less'),
    notify = require('gulp-notify'),
    jshint = require('gulp-jshint'),
    jsStylish = require('jshint-stylish'),
    uglify = require('gulp-uglify');

gulp.task("default", function(){
    gulp.watch("./less/**/*.less", ['css']);
    gulp.watch(["./config/config.js",
        "./exceptions/**/*.js",
        "./models/**/*.js",
        "./services/**/*.js",
        "./viewmodels/**/*.js",
        "./app.js"], ['js']);
});

gulp.task("js", function() {
    gulp.src(["./config/config.js",
        "./exceptions/**/*.js",
        "./models/**/*.js",
        "./services/**/*.js",
        "./viewmodels/**/*.js",
        "./app.js"])
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(sourcemaps.init())
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/js"))
        .pipe(notify({
            message: "js built"
        }))
});

gulp.task("css", function() {
    gulp.src("./less/**/*.less")
        .pipe(less())
        .pipe(csslint({
            'ids': false
        }))
        .pipe(sourcemaps.init())
        .pipe(cssMinifier())
        .pipe(concat("site.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./dist/css"))
        .pipe(notify({
            message: "css built"
        }));
});