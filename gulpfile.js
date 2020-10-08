"use strict";

const gulp = require("gulp");
const series = gulp.series;
const watch = gulp.watch;
const concat = require("gulp-concat"); // Konkatenerar ihop filer
const uglify = require("gulp-uglify-es").default; // Minifierar JavaScript-filer
const uglifycss = require("gulp-uglifycss"); // Minifierar Css-filer
const browserSync = require("browser-sync").create(); // Laddar om browsers automatiskt
const sass = require('gulp-sass'); 
sass.compiler = require('node-sass');
const babel = require('gulp-babel');
const { src } = require("gulp");

// Task för CSS
function css(){
    return gulp
        .src("./source/css/*.css") // Hämtar alla css filer i source/css-katalogen
        .pipe(concat("style.css")) // Conkatenerar alla filerna till en fil: style.css
        .pipe(uglifycss()) // Minifierar style.css
        .pipe(gulp.dest("./pub/")) // Sparar style.css i pub-katalogen
        .pipe(browserSync.stream()); // Notifiera browserSync om en ändring av CSS
}

// Task för JavaScript
function js(){
    return gulp
        .src("./source/js/*.js") // Hämtar alla js filer i source/js-katalogen
        .pipe(concat("script.js")) // Konkatenerar alla filerna till en fil: script.js
        .pipe(babel({ // Konverterar koden till ett äldre format för kompabilitet med äldre webbläsare
            presets: ['@babel/env']
        }))
        .pipe(uglify()) // Minifierar script.js
        .pipe(gulp.dest("./pub/")) // Sparar style.css i pub-katalogen
        .pipe(browserSync.stream()); // Notifiera browserSync om en ändring av JavaScript
}

// Task för HTML
function html(){
    return gulp
        .src("./source/*.html") // Hämtar alla html filer i source-katalogen
        .pipe(gulp.dest("./pub/")) // Kopierar alla html-filerna till pub-katalogen
        .pipe(browserSync.stream()); // Notifiera browserSync om en ändring av HTML
}
//Task för sass
function scss() {
    return gulp
        .src("./source/sass/*.scss")
        // .pipe(sourcemaps.init())
        .pipe(sass().on("error", sass.logError))
        .pipe(gulp.dest("pub/css"))
        .pipe(browserSync.stream());
}
// Task för images
function images(){
    return gulp
        .src("./source/images/*.*") // Hämtar alla filer i images-katalogen
        .pipe(gulp.dest("./pub/images")) // Kopierar alla filerna till pub/images-katalogen
        .pipe(browserSync.stream()); // Notifiera browserSync om en ändring av Images
}

     

const defaultTask = series(scss, js, html, images); // Skapar en default task som är serie som anropar css, js och html-funktionerna.

// Skapar en lokalserver med browsersync. Den startar en webbläsare med filen index.html i pub-katalogen
browserSync.init({
    server: {
       baseDir: "./pub",
       index: "/index.html"
    }
});

// Lägger till en watch till defaultTask som tittar på alla i filer i source-katalogen. Vid en ändring körs defaultTask. BrowserSync ska ladda om webbläsarna vid en ändring.
watch(["source/**/*.*"], defaultTask).on("change", browserSync.reload);

exports.default = defaultTask;
