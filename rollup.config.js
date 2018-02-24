import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import commonjs from 'rollup-plugin-commonjs';
import uglify from 'rollup-plugin-uglify';
import chalk from 'chalk';

export default{
  input: './src/main.js',
  output: {
    file: './dist/player.js',
    format: 'umd',
    name: 'Player',
    sourcemap: true
  },
  treeshake: false,
  plugins: [
    resolve(),
    commonjs(),
    eslint({
      exclude: ['node_modules/**']
    }),
    babel({
      exclude: ['node_modules/**', '**/*.html']
    }),
    uglify()
  ],
  onwarn: function (message) {
    if (message.code === 'EVAL' && /node_modules/.test(message.loc.file)) {
      console.log(chalk.grey(message.message));
      console.log(chalk.grey(message.url));
      return;
    }
    // console.log(JSON.stringify(message, null, 2));
    console.log(chalk.yellowBright(message.message));
  }
};
