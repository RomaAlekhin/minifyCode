const gulp = require("gulp");
const hash = require("gulp-hash-filename");
const babel = require("gulp-babel");
const cleanCSS = require("gulp-clean-css");
const fs = require("fs-extra");

const updateDir = (folder = "dist") => {
  return new Promise((resolve, reject) => {
    try {
      const stats = fs.statSync(folder);
      if (!stats.isDirectory()) return reject();

      console.log(stats.isDirectory());
      console.log(`removing folder "${folder}"`);
      fs.remove(folder)
        .then(() => {
          fs.mkdirSync(folder, { recursive: true });
          return resolve();
        })
        .catch(err => {
          console.error(err);
          return reject();
        });
    } catch (err) {
      console.log(`creating folder "${folder}"`);
      fs.mkdirSync(folder, { recursive: true });
      return resolve();
    }
  });
};

const parseJs = (path, dist) => {
  return gulp
    .src(path)
    .pipe(
      babel({
        presets: ["@babel/preset-env", ["minify", { keepFnName: true }]],
        comments: false
      })
    )
    .pipe(
      hash({
        format: "{name}.{hash:8}{ext}"
      })
    )
    .pipe(gulp.dest(dist));
};

const parseCss = (path, dist) => {
  return gulp
    .src(path)
    .pipe(cleanCSS({ compatibility: "ie8" }))
    .pipe(
      hash({
        format: "{name}.{hash:8}{ext}"
      })
    )
    .pipe(gulp.dest(dist));
};

const defaultOptions = require("./options.json");
const minifyFiles = (options = defaultOptions) => {
  const { js = [], css = [] } = options;

  updateDir(js.dist)
    .then(() => {
      try {
        js.paths.forEach(path => {
          if (fs.existsSync(path)) {
            parseJs(path, js.dist);
          } else {
            console.log(`файл "${path} не найден."`);
          }
        });
      } catch (err) {
        console.error(err);
      }
    })
    .catch(() => {
      console.error("Не удалось обновить папку со скриптами");
    });

  updateDir(css.dist)
    .then(() => {
      try {
        css.paths.forEach(path => {
          if (fs.existsSync(path)) {
            parseCss(path, css.dist);
          } else {
            console.log(`файл "${path} не найден."`);
          }
        });
      } catch (err) {
        console.error(err);
      }
    })
    .catch(() => {
      console.error("Не удалось обновить папку со стилями");
    });
};

minifyFiles();
