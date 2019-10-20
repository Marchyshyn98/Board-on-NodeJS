/* eslint-disable node/no-unpublished-require */
const gulp = require("gulp");
const sass = require("gulp-sass");
const plumber = require("gulp-plumber");
const autoprefixer = require("gulp-autoprefixer");
const cssnano = require("gulp-cssnano");
const concat = require("gulp-concat");
const uglify = require("gulp-uglify");
/* eslint-enable node/no-unpublished-require */

gulp.task("scss", () => {
  return (
    gulp
      .src('dev/scss/**/*.scss') // gulp бере исходники
      .pipe(plumber()) // .pipe() это просто функция, которая берет поток на чтение src и соединяет его вывод с вводом потока на запись....plumber-для відслідковування помилок
      .pipe(sass()) // переводить в sass
      .pipe(
        autoprefixer(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { // Autoprefixer сканирует ваши CSS файлы, и автоматически проставляет префиксы к css свойствам
          cascade: true
        }) // і переливає в плагін saas, saas компілює в css
      )
      .pipe(cssnano()) // зжимає css файли
      .pipe(gulp.dest('public/stylesheets'))
  );
});

gulp.task("scripts", () => {
  gulp
    .src([
      "dev/js/auth.js",
      "dev/js/advert.js",
      "dev/js/comment.js"
    ])
    .pipe(concat("scripts.js"))
    .pipe(uglify())
    .pipe(gulp.dest("public/javascripts"))
  return new Promise((resolve, reject) => {
    console.log("Task Scripts Completed!");
    resolve();
  });
});

gulp.task("default", gulp.series(["scss", "scripts"]), () => {
  gulp.watch("dev/scss/**/*.scss", ['scss']);
  gulp.watch("dev/js/**/*.js", ['scripts']);
});