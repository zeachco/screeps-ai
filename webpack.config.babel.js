const path = require('path');

const target = '/home/olivier/.config/Screeps/scripts/127_0_0_1___21025/default'

module.exports = {
   entry: {
      main: path.join(__dirname, 'src')
   },
   mode: 'development',
   resolve: {
      extensions: ['.ts', '.js', '.json']
   },
   output: {
      path: target,
      filename: 'main.js'
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: 'babel-loader',
         },
         {
            test: /\.js$/,
            use: ["source-map-loader"],
            enforce: "pre"
         }]
   },
   plugins: [],
   stats: {
      colors: true
   },
   devtool: 'source-map'
};