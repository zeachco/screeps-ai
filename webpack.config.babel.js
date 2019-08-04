const path = require('path');
require('dotenv').config();

const target = process.env.BUILD;
if (!target) {
   console.error('please define BUILD in .env file');
   process.exit(0);
}

module.exports = {
   entry: {
      main: path.join(__dirname, 'src'),
   },
   mode: 'development',
   resolve: {
      extensions: ['.ts', '.js', '.json'],
   },
   output: {
      path: target,
      filename: 'main.js',
   },
   module: {
      rules: [
         {
            test: /\.tsx?$/,
            loader: 'babel-loader',
         },
         {
            test: /\.js$/,
            use: ['source-map-loader'],
            enforce: 'pre',
         },
      ],
   },
   plugins: [],
   stats: {
      colors: true,
   },
   devtool: 'source-map',
};
