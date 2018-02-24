const fs = require('fs-extra');
const chokidar = require('chokidar');

function copy() {
  var watcher = chokidar.watch(['./src/index.html', './src/styles.css', './src/data/**/*'], {
    ignored: /[\/\\]\./, persistent: true, ignoreInitial: true
  });

  fs.copySync('./src/index.html', './dist/index.html');
  fs.copySync('./src/styles.css', './dist/styles.css');
  fs.copySync('./src/data', './dist/data');

  watcher
    .on('change', path => {
      console.log(`File changed:  ${path}`);
      fs.copySync(path, path.replace('src', 'dist'));
    }).on('add', path => {
      console.log(`File added:  ${path}`);
      fs.copySync(path, path.replace('src', 'dist'));
    })
    .on('error', error => console.log(`Watcher error: ${error}`));

  console.log('Watcher initiated');
};

copy();