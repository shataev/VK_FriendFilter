const path = require('path');

module.exports = {
	entry: [
		'./js/scripts.js',
	],
	output: {
		filename: './js/bundle.js',
        path: path.resolve(__dirname),
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
			}
		]
	}
};