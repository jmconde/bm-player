const fs = require('fs-extra');

module.exports = function () {
  fs.copySync('./src/index.html', './dist/index.html');
  fs.copySync('./src/styles.css', './dist/styles.css');
  fs.copySync('./src/data', './dist/data');
};
