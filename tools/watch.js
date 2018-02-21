const rollup = require('rollup');
const config = require('../rollup.config');

const watchOpts = {

};

const watcher = rollup.watcher(watchOpts);

watcher.on('END', event => {
  console.log('Bundles ended');
});
