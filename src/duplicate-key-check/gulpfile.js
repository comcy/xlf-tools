var gulp = require("gulp");
var tslint = require("gulp-tslint");
var ts = require("gulp-typescript");
var tsProject = ts.createProject("tsconfig.json");
var sourcemaps = require("gulp-sourcemaps");
var del = require("del");

// import gulp from "gulp";
// import tslint from "gulp-stlint";
// import ts from "gulp-typescript";
// // import tsProject from ts.createProject('tsconfig.json");
// import sourcemaps from "sourcemaps";
// import del from "del";

//-----------------------------------------------------

// Decalrations

var paths = {
  files: ["package.json", "README.md", "LICENSE"],
  dist: "dist",
  tslint: "tsconfig.json",
};

//-----------------------------------------------------

// Common gulp tasks:

// TSLint
gulp.task("ts-lint", () =>
  gulp.src(paths.srcTS).pipe(tslint(paths.tslint)).pipe(tslint.report())
);

// Clean temp and dist folder
gulp.task("clean", function () {
  del([paths.dist]);
});

//-----------------------------------------------------

// Build pipeline
// Copy tasks

// TS files
// gulp.task("typescript:dist", function () {
//   var tsResult = tsProject.src()
//     .pipe(tsProject());

//   return tsResult.js.pipe(gulp.dest(paths.dist));
// });

gulp.task("typescript:dist", function () {
  return tsProject
    .src()
    .pipe(sourcemaps.init())
    .pipe(tsProject())
    .pipe(sourcemaps.write())
    .pipe(gulp.dest(paths.dist));
});

// Additional project files
gulp.task("additional:dist", function () {
  return gulp.src(paths.files).pipe(gulp.dest(paths.dist));
});

// Copy tasks bundle
gulp.task("copy:dist", ["additional:dist", "typescript:dist"]);

// Build app to `dist`: Starting point
gulp.task("build", ["clean", "copy:dist"]);

// Gulp default starting point
gulp.task("default", ["build"], function () {});
