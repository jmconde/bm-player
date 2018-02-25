var sass = require('node-sass');
var fs = require('fs-extra');

function render() {
  sass.render({
    file: './src/styles/styles.scss'
  }, function(err, result) {
    fs.ensureFileSync('./dist/bm-player.css');
    fs.writeFileSync('./dist/bm-player.css',  result.css);
  });
}

module.exports = render;