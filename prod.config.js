const path = require('path');
//const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
//const UnminifiedWebpackPlugin = require('unminified-webpack-plugin');
const webpack = require('webpack');
const CopyPlugin = require("copy-webpack-plugin");
const TerserPlugin = require("terser-webpack-plugin");


module.exports = {
    mode: 'production',
    watch: true,


    optimization: {
      minimize: true,
      minimizer: [new TerserPlugin()],
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: true
            }
          }
        })
      ]
    },


    plugins: [
        
        new webpack.ProvidePlugin({
            PIXI: 'pixi.js'
          }),
        

        new CopyPlugin({
            patterns: [
              { from: "./assets", to: "./assets" },
            
            ],
            options: {
              concurrency: 100,
            },
          }),

       
       /*
        new UnminifiedWebpackPlugin({
            postfix:''
        })
    */
   
    ],




    entry: ["./src/app.js"],
    module: {
        rules: [
            {
            test: /\.js$/,
            exclude: [/(node_modules)/, 
                        path.resolve(__dirname, 'browser.js'), 
                        path.resolve(__dirname, 'bootstrap.js')],
            use: {
                loader: "babel-loader",
                options: {  
                    presets: ['@babel/preset-env']
                  }
            }

            },

            {
                test: /\.css$/i,
                use: ['style-loader', 'css-loader'],
              },

              {
                test: /\.(jpg|png|svg)$/,
                  loader: 'url-loader'
              
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
              }


        ]
    },
    devtool: 'inline-source-map',
    output: {
        filename:   "bundle.js",
        path: path.resolve(__dirname + "/dist")
         
    }
};