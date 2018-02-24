const {exec} = require('child_process');

var rollup = exec('rollup -c --watch');
var tools = exec('node tools/copy');
var server = exec('npm run server');


rollup.stdout.on('data', function (data) {
  console.log('stdout: ' + data.toString());
});

rollup.stderr.on('data', function (data) {
  console.log('stderr: ' + data.toString());
});

rollup.on('exit', function (code) {
  console.log('child process exited with code ' + code.toString());
});

tools.stdout.on('data', function (data) {
  console.log('stdout: ' + data.toString());
});

tools.stderr.on('data', function (data) {
  console.log('stderr: ' + data.toString());
});

tools.on('exit', function (code) {
  console.log('child process exited with code ' + code.toString());
});

server.stdout.on('data', function (data) {
  console.log('stdout: ' + data.toString());
});

server.stderr.on('data', function (data) {
  console.log('stderr: ' + data.toString());
});

server.on('exit', function (code) {
  console.log('child process exited with code ' + code.toString());
});

