const {exec} = require('child_process');

var argv = require('minimist')(process.argv.slice(2));
var rollupExec = 'rollup -c';
var toolsExec = 'node tools/copy'
var serverExec = 'browser-sync start --config \"bs-config.js\"';
var rollup, tools, server;

if (argv.w || argv.watch) {
  rollupExec += ' --watch';
  toolsExec += ' --watch';
}

rollup = exec(rollupExec);

rollup.stdout.on('data', function (data) {
  console.log('stdout: ' + data.toString());
});

rollup.stderr.on('data', function (data) {
  console.log('stderr: ' + data.toString());
});

rollup.on('exit', function (code) {
  console.log('child process exited with code ' + code.toString());
});

tools = exec(toolsExec);

tools.stdout.on('data', function (data) {
  console.log('stdout: ' + data.toString());
});

tools.stderr.on('data', function (data) {
  console.log('stderr: ' + data.toString());
});

tools.on('exit', function (code) {
  console.log('child process exited with code ' + code.toString());
});

if (argv.server) {
  server = exec(serverExec);
  server.stdout.on('data', function (data) {
    console.log('stdout: ' + data.toString());
  });

  server.stderr.on('data', function (data) {
    console.log('stderr: ' + data.toString());
  });

  server.on('exit', function (code) {
    console.log('child process exited with code ' + code.toString());
  });
}
