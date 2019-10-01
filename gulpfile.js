const gulp = require("gulp");
const hash = require("gulp-hash-filename");
const babel = require("gulp-babel");
const cleanCSS = require("gulp-clean-css");

const { writeFileList, checkedPaths, updateDir } = require("./utils.js");

const defaultOptions = require("./options.js");
const babelOptions = {
  presets: [
    [
      "@babel/preset-env",
      {
        targets: "last 1 version, > 1%, not dead"
      }
    ],
    [
      "minify",
      { builtIns: false, evaluate: false, mangle: false, keepFnName: true }
    ]
  ],
  comments: false
};

/**
 * Очистка старых собранных файлов
 *
 * @param {*} cb
 */
function clean(cb) {
  const { js = {}, css = {} } = defaultOptions;
  updateDir(js.dist)
    .then(() => {
      updateDir(css.dist)
        .then(cb)
        .catch(() => {
          console.error("Не удалось обновить папку со скриптами");
        });
    })
    .catch(() => {
      console.error("Не удалось обновить папку со стилями");
    });
}

/**
 * Минификация и версионирование скриптов
 */
function parseJs() {
  const { js = [] } = defaultOptions;
  const paths = checkedPaths(js.paths);

  return gulp
    .src(paths)
    .pipe(babel(babelOptions))
    .pipe(
      hash({
        format: "{name}.{hash:8}{ext}"
      })
    )
    .pipe(gulp.dest(js.dist));
}

/**
 * Минификация и версионирование стилей
 */
function parseCss() {
  const { css = [] } = defaultOptions;
  const paths = checkedPaths(css.paths);

  return gulp
    .src(paths)
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(
      hash({
        format: "{name}.{hash:8}{ext}"
      })
    )
    .pipe(gulp.dest(css.dist));
}

/**
 * Создание файлов со списком
 * новых сгенерированных стилей и скриптов
 *
 * @param {*} cb
 */
function createIncluded(cb) {
  const { js = {}, css = {} } = defaultOptions;
  writeFileList(js);
  writeFileList(css);
  cb();
}

exports.default = gulp.series(clean, parseJs, parseCss, createIncluded);
