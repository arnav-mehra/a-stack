import strip from '@rollup/plugin-strip';

export default {
  input: `./build/main.js`,
  output: [
    {
      file: `./dist/bundle.js`,
      format: 'es'
    },
  ],
  plugins: [
    strip({
      functions: [ 'console.log' ]
    })
  ]
};