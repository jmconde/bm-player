const fs = require('fs-extra');
const sassTask = require('./sass');
const watchTask = require('./watch');

var argv2 = process.argv[2];

fs.copySync('./src/demo/', './dist/demo/');
sassTask();

if (argv2 === '--watch' || argv2 === '-w') {
  watchTask();
}
