const fs = require("fs-extra");

/**
 * Удаление файла со списком импортированных файлов
 *
 * @param {String} path
 *
 * @return {Promise}
 */
const removeInclude = path => {
  return new Promise(resolve => {
    if (fs.existsSync(path)) {
      fs.unlink(path, err => {
        if (err) throw err;
        console.log(`${path} was deleted`);
        return resolve();
      });
    } else return resolve();
  });
};

/**
 * Получение списка сгенерированных файлов
 * с сортировкой как в исходных настройках
 *
 * @param {Array} paths - пути в исходных настройках
 * @param {Array} files - имена сгенерированных файлов
 *
 * @return {Array}
 */
const getOrderedFiles = (paths, files) => {
  const getIndex = file => {
    const fileArray = file.split(".");

    const name = fileArray.slice(0, -2).join(".");
    const ext = fileArray.slice(-1).join(".");

    return paths.findIndex(path => path.includes([name, ext].join(".")));
  };

  return files.sort((fileA, fileB) => getIndex(fileA) - getIndex(fileB));
};

/**
 * Обход папки с новыми сгенерированными файлами
 * и запись списка подлючаемых стилей и скриптов
 *
 * @param {Object} configObject
 */
function writeFileList(configObject = {}) {
  const { dist, include, paths, pattern } = configObject;

  const addFile = files => {
    const orderedFiles = getOrderedFiles(paths, files);
    orderedFiles.map(file => {
      const includePath = include;
      const data = pattern.replace("{{file}}", file) + "\n";
      fs.appendFileSync(includePath, data);
    });
  };

  return removeInclude(include).then(() => {
    return fs.readdir(dist, (err, files) => addFile(files));
  });
}

/**
 * Фильтрация исходных путей файлов,
 * если файла не существует
 *
 * @param {Array} paths
 *
 * @return {Array}
 */
function checkedPaths(paths) {
  return paths.filter(path => {
    const issetFile = fs.existsSync(path);
    if (!issetFile) console.error(`файл "${path} не найден."`);
    return issetFile;
  });
}

/**
 * Удаление старой папки со сгенерированными файлами
 *
 * @param {String} folder
 *
 * @return {Promise}
 */
function updateDir(folder = "dist") {
  return new Promise((resolve, reject) => {
    try {
      const stats = fs.statSync(folder);
      if (!stats.isDirectory()) return reject();

      fs.remove(folder)
        .then(() => resolve())
        .catch(err => {
          console.error(err);
          return reject();
        });
    } catch (err) {
      return resolve();
    }
  });
}

exports.writeFileList = writeFileList;
exports.checkedPaths = checkedPaths;
exports.updateDir = updateDir;
