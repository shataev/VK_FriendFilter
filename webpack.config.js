const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require("extract-text-webpack-plugin");
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
	entry: [
		'./src/js/index.js',
		'./src/css/styles.css',
	],
	output: {
		filename: './js/bundle.js',
		publicPath: "./../"
	},
	devtool: "source-map",
	module: {
		rules: [
			{
				test: /\.js$/,
				include: path.resolve(__dirname, 'src/js'),
				use: {
					loader: 'babel-loader',
					options: {
						presets: 'env'
					}
				}
			},
			{
				test: /.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
				//exclude: [path.resolve(__dirname, "src/img")],
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'fonts/[name].[ext]'
						}
					}
				]
			},
			{
				test: /\.(png|jpg|gif|svg)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: 'img/[name].[ext]'
						}
					}
				]
			},
			{
				test: /\.css$/,
				include: path.resolve(__dirname, 'src/css'),
				use: ExtractTextPlugin.extract({
					use: [
						{
							loader: "css-loader",
							options: {
								sourceMap: true,
								minimize: false,
								//url: true //не корректно работают ссылки при значении true
							}
						},
						{
							loader: "resolve-url-loader",
							options: {
								debug: true
							}
						}
					]
				})
			}
		]
	},
	plugins: [
		new CleanWebpackPlugin(['dist']),
		new ExtractTextPlugin({
			filename: './css/styles.bundle.css',
			allChunks: true,
		}),
		new CopyWebpackPlugin([
			{
				from: './src/fonts',
				to: './fonts'
			},
			{
				from: './src/favicon',
				to: './favicon'
			},
			{
				from: './src/img',
				to: './img'
			},
			{
				from: './src/html',
				to: './html'
			}
		]),
	]
};