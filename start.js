const gulp = require("gulp");
const cleanCSS = require("gulp-clean-css");
const uglify = require("gulp-uglify");
const fs = require("fs-extra");
const crypto = require("crypto");

const options = require("./options.json");

const updateDir = (folder = "dist") => {
  try {
    const stats = fs.statSync(folder);
    if (stats.isDirectory()) {
      console.log(stats.isDirectory());
      console.log(`removing folder "${folder}"`);
      fs.remove(folder)
        .then(() => {
          fs.mkdirSync(folder, { recursive: true });
        })
        .catch(err => console.error(err));
      // fs.rmdirSync(folder, { recursive: true });
    }
  } catch (err) {
    console.log(`creating folder "${folder}"`);
    fs.mkdirSync(folder, { recursive: true });
  }
};

const writeFile = (base, path, data) => {
  const getFileName = (path, hash) => {
    const all = path.replace(/\\/g, "/").split("/");
    const file = all.slice(-1)[0];

    const extension = file.split(".").slice(-1);
    const name = file.split(".").slice(0, -1);

    return [name, hash, extension].join(".");
  };

  const hash = crypto
    .createHash("md5")
    .update(data)
    .digest("hex")
    .slice(0, 8);

  const fileName = getFileName(path, hash);

  fs.appendFile(`${base}/${fileName}`, data, () => {
    console.log(fileName);
    console.log(data);
    console.log("done!");
  });
};

const minifyFiles = (data = {}) => {
  const { js = [], css = [] } = data;

  updateDir(js.dist);
  js.paths.forEach(jsPath => {
    const parsedData = jsPath;
    writeFile(js.dist, jsPath, parsedData);
  });

  updateDir(css.dist);
  css.paths.forEach(cssPath => {
    const parsedData = cssPath;
    writeFile(css.dist, cssPath, parsedData);
  });
};

// const { css = {}, js = {} } = options;
// const data = { js: js.paths, css: css.paths };

minifyFiles(options);
/*
try {
  const filePaths = fs.readFileSync("./filePaths.json", "utf8");
  const data = JSON.parse(filePaths);
  updateDir(jsDistFolder);
  updateDir(cssDistFolder);
  minifyFiles(data);
} catch (err) {
  console.error(err);
}
*/
