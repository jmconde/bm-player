const fs = require('fs-extra');
const chokidar = require('chokidar');
const sassTask = require('./sass');

function doThing (path) {
  if (/styles/.test(path)) {
    sassTask();
  } else {
    fs.copySync(path, path.replace('src', 'dist'));
  }
}

module.exports = function () {
  chokidar.watch(['./src/styles/**/*', './src/demo/**/*'], {
    ignored: /[\/\\]\./, persistent: true, ignoreInitial: true
  }).on('change', path => {
    console.log(`File changed:  ${path}`);
    doThing(path);
  }).on('add', path => {
    console.log(`File added:  ${path}`);
    doThing(path);
  }).on('error', error => console.log(`Watcher error: ${error}`));
  console.log('Watcher initiated');
};
