
module.exports = {
	entry: {
		demo: "./examples/demo/App.js",
	},

	output: {
		path: __dirname,
		filename: "./bundles/[name].js"
	},

	watch:true,

	devtool: 'source-map',

	module: {
		loaders: [
			{ test: /\.js$/,
				exclude: /node_modules/,
				loader: "babel-loader"
			}
		]
	}
};
