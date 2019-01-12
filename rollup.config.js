import babel from 'rollup-plugin-babel'

export default {
  input: 'src/index.js',
  output: {
    name: 'Reduxed',
    file: 'lib/index.js',
    format: 'umd',
  },
  plugins: [babel()],
}
