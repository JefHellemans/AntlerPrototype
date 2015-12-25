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
    gulp.watch("./src/less/**/*.less", ['css']);
    gulp.watch(["./src/config/config.js",
        "./src/exceptions/**/*.js",
        "./src/models/**/*.js",
        "./src/services/**/*.js",
        "./src/viewmodels/**/*.js",
        "./src/app.js"], ['js']);
    gulp.watch(["./src/lib/Canvas/**/*.js"], ['canvas']);
});

gulp.task("js", function() {
    gulp.src(["./src/config/config.js",
        "./src/exceptions/**/*.js",
        "./src/models/**/*.js",
        "./src/viewmodels/**/*.js",
        "./src/app.js",
        "./src/controllers/**/*.js"
        ])
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(sourcemaps.init())
        .pipe(concat("app.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./src/dist/js"))
        .pipe(notify({
            message: "js built"
        }))
});

gulp.task("canvas", function() {
    gulp.src(["./src/lib/Canvas/math.js",
        "./src/lib/Canvas/animation.js",
        "./src/lib/Canvas/paragraph.js",
        "./src/lib/Canvas/drawable.js",
        "./src/lib/Canvas/canvas.js"])
        .pipe(jshint())
        .pipe(jshint.reporter())
        .pipe(sourcemaps.init())
        .pipe(concat("canvas.min.js"))
        .pipe(uglify())
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./src/dist/js"))
        .pipe(notify({
            message: "canvas built"
        }))
});

gulp.task("css", function() {
    gulp.src("./src/less/**/*.less")
        .pipe(less())
        .pipe(csslint({
            'ids': false
        }))
        .pipe(sourcemaps.init())
        .pipe(cssMinifier())
        .pipe(concat("site.css"))
        .pipe(sourcemaps.write())
        .pipe(gulp.dest("./src/dist/css"))
        .pipe(notify({
            message: "css built"
        }));
});
