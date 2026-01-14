const path = require('node:path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

module.exports = (_env, argv) => {
  const isProduction = argv.mode === 'production'

  return {
    entry: path.resolve(__dirname, 'src/main.tsx'),
    output: {
      path: path.resolve(__dirname, 'dist'),
      filename: isProduction ? '[name].[contenthash].js' : '[name].js',
      publicPath: '/',
      clean: true,
    },
    devtool: isProduction ? 'source-map' : 'eval-cheap-module-source-map',
    resolve: {
      extensions: ['.tsx', '.ts', '.js'],
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx)$/,
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: [
                ['@babel/preset-env', { targets: 'defaults' }],
                ['@babel/preset-react', { runtime: 'automatic' }],
                ['@babel/preset-typescript'],
              ],
              plugins: [!isProduction && require.resolve('react-refresh/babel')].filter(Boolean),
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader', 'postcss-loader'],
        },
        {
          test: /\.(png|jpe?g|gif|webp|svg)$/i,
          type: 'asset',
        },
      ],
    },
    plugins: [
      new HtmlWebpackPlugin({
        template: path.resolve(__dirname, 'index.html'),
      }),
      !isProduction && new webpack.HotModuleReplacementPlugin(),
      !isProduction && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    devServer: {
      port: 5173,
      historyApiFallback: true,
      hot: true,
      proxy: [
        {
          context: ['/api'],
          target: 'http://localhost:3001',
          changeOrigin: true,
        },
      ],
    },
  }
}
