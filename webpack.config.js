const path = require('path');
 const HtmlWebpackPlugin = require('html-webpack-plugin');
 //const UglifyJsPlugin = require('uglifyjs-webpack-plugin');


 module.exports = {
  mode: 'development',
   entry: {
     index: './src/app.js'
   },
   devtool: 'inline-source-map',
  devServer: {
    static: './',
  },
  

   plugins: [
     new HtmlWebpackPlugin({
      title: 'Development',
    }),


   ],

   module: {
    rules: [
      {
        test: /\.m?js$/,
        exclude: /(node_modules)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['@babel/preset-env']
          }
        }
      },
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      
      {
        test: /\.s[ac]ss$/i,
        use: [
          // Creates `style` nodes from JS strings
          "style-loader",
          // Translates CSS into CommonJS
          "css-loader",
          // Compiles Sass to CSS
          "sass-loader",
        ],
        
      },

   /*
      {
        test: /\.(jpg|png|svg)$/,
        use: {
          loader: 'url-loader',
        },
      },
      */

      {
        test: /\.(png|svg|jpg|jpeg|gif|mp3)$/i,
        type: 'asset/resource',
      },

/*
{
  test: /\.png$/,
  type: 'asset'        
},
      {
        test: /\.(png|jpe?g|gif|svg)$/i,
        use: [
          {
            loader: 'file-loader',
          },
        ],
      }
*/

    ]
  },
  
   
  
   output: {
     filename: '[name].bundle.js',
     path: path.resolve(__dirname, 'dist'),
     publicPath: 'auto',
     clean: true,
   },
 };
