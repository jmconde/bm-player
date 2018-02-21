import resolve from 'rollup-plugin-node-resolve';
import babel from 'rollup-plugin-babel';
import eslint from 'rollup-plugin-eslint';
import commonjs from 'rollup-plugin-commonjs';

export default{
  input: './src/main.js',
  output: {
    file: './dist/player.js',
    format: 'umd',
    name: 'Player'
  },
  plugins: [
    resolve(),
    eslint({
      exclude: [
        'src/styles/**',
        'node_modules/**'
      ]
    }),
    commonjs(),
    babel({
      exclude: 'node_modules/**',
    })
  ]
};
